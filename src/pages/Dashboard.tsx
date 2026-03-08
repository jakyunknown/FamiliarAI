import React, { useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Card from '../components/ui/Card';

type TimeFilter = '24h' | 'week' | 'month' | 'year' | 'all';
type StatusFilter = 'all' | 'recognized' | 'unknown' | 'labeled';
type PeopleSort = 'recent' | 'frequent' | 'name';
type SectionKey = 'overview' | 'met' | 'interactions' | 'alerts' | 'directory';
type InteractionStatus = 'recognized' | 'unknown' | 'labeled';

interface DashboardProps {
  user: User;
  onSignOut: () => void | Promise<void>;
}

interface Person {
  id: string;
  name: string;
  relationship: string;
  lastSeenHoursAgo: number;
  seenCount: number;
  note?: string;
  avatar: string;
}

interface Interaction {
  id: string;
  personId?: string;
  name: string;
  status: InteractionStatus;
  timestampHoursAgo: number;
  thumbnail: string;
}

interface Alert {
  id: string;
  timestampHoursAgo: number;
  snapshot: string;
  status: 'pending';
}

const HOURS = {
  '24h': 24,
  week: 24 * 7,
  month: 24 * 30,
  year: 24 * 365,
  all: Number.POSITIVE_INFINITY,
} as const;

const peopleSeed: Person[] = [
  { id: 'p1', name: 'Anita Rao', relationship: 'Daughter', lastSeenHoursAgo: 2, seenCount: 43, note: 'Visits every evening.', avatar: 'AR' },
  { id: 'p2', name: 'Michael Chen', relationship: 'Son', lastSeenHoursAgo: 26, seenCount: 31, note: 'Calls often, visits weekends.', avatar: 'MC' },
  { id: 'p3', name: 'Rosa Patel', relationship: 'Caregiver', lastSeenHoursAgo: 5, seenCount: 58, note: 'Morning routine support.', avatar: 'RP' },
  { id: 'p4', name: 'David Morales', relationship: 'Neighbor', lastSeenHoursAgo: 88, seenCount: 14, note: 'Checks in midweek.', avatar: 'DM' },
  { id: 'p5', name: 'Lila Brooks', relationship: 'Granddaughter', lastSeenHoursAgo: 12, seenCount: 19, note: 'Weekend lunch visits.', avatar: 'LB' },
  { id: 'p6', name: 'Nina Kapoor', relationship: 'Nurse', lastSeenHoursAgo: 3, seenCount: 65, note: 'Medication reminders.', avatar: 'NK' },
];

const interactionSeed: Interaction[] = [
  { id: 'i1', personId: 'p1', name: 'Anita Rao', status: 'recognized', timestampHoursAgo: 2, thumbnail: 'AR' },
  { id: 'i2', personId: 'p6', name: 'Nina Kapoor', status: 'recognized', timestampHoursAgo: 3, thumbnail: 'NK' },
  { id: 'i3', name: 'Unknown Person', status: 'unknown', timestampHoursAgo: 6, thumbnail: '??' },
  { id: 'i4', personId: 'p3', name: 'Rosa Patel', status: 'labeled', timestampHoursAgo: 20, thumbnail: 'RP' },
  { id: 'i5', personId: 'p5', name: 'Lila Brooks', status: 'recognized', timestampHoursAgo: 36, thumbnail: 'LB' },
  { id: 'i6', name: 'Unknown Person', status: 'unknown', timestampHoursAgo: 42, thumbnail: '??' },
  { id: 'i7', personId: 'p2', name: 'Michael Chen', status: 'recognized', timestampHoursAgo: 78, thumbnail: 'MC' },
  { id: 'i8', personId: 'p4', name: 'David Morales', status: 'labeled', timestampHoursAgo: 116, thumbnail: 'DM' },
];

const alertSeed: Alert[] = [
  { id: 'a1', timestampHoursAgo: 6, snapshot: 'U1', status: 'pending' },
  { id: 'a2', timestampHoursAgo: 30, snapshot: 'U2', status: 'pending' },
  { id: 'a3', timestampHoursAgo: 62, snapshot: 'U3', status: 'pending' },
  { id: 'a4', timestampHoursAgo: 126, snapshot: 'U4', status: 'pending' },
];

const timeLabel = (hoursAgo: number) => {
  if (hoursAgo < 1) return 'just now';
  if (hoursAgo < 24) return `${Math.round(hoursAgo)}h ago`;
  return `${Math.round(hoursAgo / 24)}d ago`;
};

const statusBadgeClass = (status: InteractionStatus) => {
  if (status === 'recognized') return 'badge-recognized';
  if (status === 'labeled') return 'badge-labeled';
  return 'badge-unknown';
};

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [peopleTimeFilter, setPeopleTimeFilter] = useState<Exclude<TimeFilter, '24h'>>('week');
  const [peopleSort, setPeopleSort] = useState<PeopleSort>('recent');
  const [interactionTimeFilter, setInteractionTimeFilter] = useState<Extract<TimeFilter, '24h' | 'week' | 'month' | 'all'>>('week');
  const [interactionStatusFilter, setInteractionStatusFilter] = useState<StatusFilter>('all');
  const [alertsTimeFilter, setAlertsTimeFilter] = useState<'today' | '3days' | 'week'>('week');
  const [directoryQuery, setDirectoryQuery] = useState('');
  const [topSearch, setTopSearch] = useState('');
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [labelName, setLabelName] = useState('');
  const [labelRelationship, setLabelRelationship] = useState('');
  const [toast, setToast] = useState('');

  const filteredPeople = useMemo(() => {
    const maxHours = HOURS[peopleTimeFilter];
    const base = peopleSeed.filter((person) => person.lastSeenHoursAgo <= maxHours);
    const searched = topSearch
      ? base.filter((person) => `${person.name} ${person.relationship}`.toLowerCase().includes(topSearch.toLowerCase()))
      : base;
    if (peopleSort === 'recent') return [...searched].sort((a, b) => a.lastSeenHoursAgo - b.lastSeenHoursAgo);
    if (peopleSort === 'frequent') return [...searched].sort((a, b) => b.seenCount - a.seenCount);
    return [...searched].sort((a, b) => a.name.localeCompare(b.name));
  }, [peopleSort, peopleTimeFilter, topSearch]);

  const filteredInteractions = useMemo(() => {
    const maxHours = HOURS[interactionTimeFilter];
    const byTime = interactionSeed.filter((item) => item.timestampHoursAgo <= maxHours);
    const byStatus =
      interactionStatusFilter === 'all'
        ? byTime
        : byTime.filter((item) => item.status === interactionStatusFilter);
    return byStatus;
  }, [interactionStatusFilter, interactionTimeFilter]);

  const filteredAlerts = useMemo(() => {
    const maxHours = alertsTimeFilter === 'today' ? 24 : alertsTimeFilter === '3days' ? 72 : 168;
    return alertSeed.filter((alert) => alert.timestampHoursAgo <= maxHours);
  }, [alertsTimeFilter]);

  const filteredDirectory = useMemo(() => {
    const query = directoryQuery.trim().toLowerCase();
    if (!query) return peopleSeed;
    return peopleSeed.filter((person) =>
      `${person.name} ${person.relationship} ${person.note || ''}`.toLowerCase().includes(query)
    );
  }, [directoryQuery]);

  const stats = {
    peopleTracked: peopleSeed.length,
    pendingAlerts: alertSeed.length,
    interactionsRecent: interactionSeed.filter((item) => item.timestampHoursAgo <= 24 * 7).length,
  };

  const submitLabel = (event: React.FormEvent) => {
    event.preventDefault();
    if (!labelName.trim() || !labelRelationship.trim()) return;
    setToast(`Saved: ${labelName.trim()} (${labelRelationship.trim()})`);
    setSelectedAlert(null);
    setLabelName('');
    setLabelRelationship('');
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-700 pb-20 md:pb-0">
      <div className="pointer-events-none absolute inset-0">
        <div className="grid-overlay" />
      </div>

      <header className="relative sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Familiar</p>
            <p className="text-lg font-semibold text-slate-900">Caregiver Dashboard</p>
          </div>
          <div className="ml-auto flex w-full items-center gap-2 md:w-auto">
            <input
              type="text"
              placeholder="Search person..."
              value={topSearch}
              onChange={(event) => setTopSearch(event.target.value)}
              className="input-field md:min-w-[220px]"
            />
            <button
              type="button"
              onClick={() => onSignOut()}
              className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-6 md:py-8">
        <section id="overview" className="scroll-mt-24">
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Caregiver'}
          </h1>
          <p className="mt-1 text-slate-600">Monitor familiar faces, unknown alerts, and recent interactions.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-slate-500">Total People Tracked</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">{stats.peopleTracked}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-slate-500">Pending Alerts</p>
              <p className="mt-2 text-3xl font-bold text-slate-700">{stats.pendingAlerts}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-slate-500">Interactions (Last 7d)</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">{stats.interactionsRecent}</p>
            </Card>
          </div>
        </section>

        <section id="met" className="mt-8 scroll-mt-24">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">People You&apos;ve Met</h2>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select
                value={peopleTimeFilter}
                onChange={(event) => setPeopleTimeFilter(event.target.value as Exclude<TimeFilter, '24h'>)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="year">Last Year</option>
                <option value="all">All Time</option>
              </select>
              <select
                value={peopleSort}
                onChange={(event) => setPeopleSort(event.target.value as PeopleSort)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="frequent">Most Frequent</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredPeople.map((person) => (
              <button
                type="button"
                key={person.id}
                onClick={() =>
                  setSelectedInteraction({
                    id: `meta-${person.id}`,
                    personId: person.id,
                    name: person.name,
                    status: 'recognized',
                    timestampHoursAgo: person.lastSeenHoursAgo,
                    thumbnail: person.avatar,
                  })
                }
                className="text-left"
              >
                <Card className="feature-card p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                      {person.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{person.name}</p>
                      <p className="text-sm text-slate-500">{person.relationship}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">Last seen {timeLabel(person.lastSeenHoursAgo)}</p>
                  <p className="text-sm text-slate-500">Seen {person.seenCount} times</p>
                </Card>
              </button>
            ))}
          </div>
        </section>

        <section id="interactions" className="mt-8 scroll-mt-24">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Recent Interactions</h2>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <select
                value={interactionTimeFilter}
                onChange={(event) => setInteractionTimeFilter(event.target.value as typeof interactionTimeFilter)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="24h">Last 24h</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="all">All</option>
              </select>
              <select
                value={interactionStatusFilter}
                onChange={(event) => setInteractionStatusFilter(event.target.value as StatusFilter)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="recognized">Recognized</option>
                <option value="unknown">Unknown</option>
                <option value="labeled">Labeled</option>
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {filteredInteractions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedInteraction(item)}
                className="w-full text-left"
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {item.thumbnail}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{timeLabel(item.timestampHoursAgo)}</p>
                    </div>
                    <span className={statusBadgeClass(item.status)}>
                      {item.status[0].toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </section>

        <section id="alerts" className="mt-8 scroll-mt-24">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">Pending Unknown Alerts</h2>
            <div className="ml-auto">
              <select
                value={alertsTimeFilter}
                onChange={(event) => setAlertsTimeFilter(event.target.value as typeof alertsTimeFilter)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="3days">Last 3 Days</option>
                <option value="week">Last Week</option>
              </select>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="p-4">
                <div className="flex h-24 items-center justify-center rounded-lg bg-slate-100 text-2xl font-semibold text-slate-500">
                  {alert.snapshot}
                </div>
                <p className="mt-3 text-sm text-slate-600">{timeLabel(alert.timestampHoursAgo)}</p>
                <span className="badge-unknown mt-2 inline-flex">Pending</span>
                <button
                  type="button"
                  onClick={() => setSelectedAlert(alert)}
                  className="mt-3 w-full rounded-lg bg-emerald-400 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-500"
                >
                  Label Person
                </button>
              </Card>
            ))}
          </div>
        </section>

        <section id="directory" className="mt-8 scroll-mt-24">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 md:text-2xl">People Directory</h2>
            <input
              type="text"
              placeholder="Search by name or relationship"
              value={directoryQuery}
              onChange={(event) => setDirectoryQuery(event.target.value)}
              className="input-field ml-auto w-full md:w-80"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredDirectory.map((person) => (
              <Card key={person.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{person.name}</p>
                    <p className="text-sm text-slate-500">{person.relationship}</p>
                  </div>
                  <span className="text-xs text-slate-400">{timeLabel(person.lastSeenHoursAgo)}</span>
                </div>
                {person.note && <p className="mt-3 text-sm text-slate-600">{person.note}</p>}
              </Card>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {[
            { key: 'overview', label: 'Home' },
            { key: 'met', label: 'People' },
            { key: 'interactions', label: 'Events' },
            { key: 'alerts', label: 'Alerts' },
            { key: 'directory', label: 'Directory' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveSection(item.key as SectionKey);
                document.getElementById(item.key)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`rounded-md px-2 py-2 text-xs font-medium ${
                activeSection === item.key ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {selectedInteraction && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-slate-900">Interaction Detail</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p><span className="font-medium text-slate-900">Name:</span> {selectedInteraction.name}</p>
              <p><span className="font-medium text-slate-900">Status:</span> {selectedInteraction.status}</p>
              <p><span className="font-medium text-slate-900">When:</span> {timeLabel(selectedInteraction.timestampHoursAgo)}</p>
              <p><span className="font-medium text-slate-900">Snapshot:</span> {selectedInteraction.thumbnail}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedInteraction(null)}
              className="mt-5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
          </Card>
        </div>
      )}

      {selectedAlert && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/30 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-slate-900">Label Unknown Person</h3>
            <p className="mt-2 text-sm text-slate-600">Alert captured {timeLabel(selectedAlert.timestampHoursAgo)}.</p>
            <form onSubmit={submitLabel} className="mt-4 space-y-3">
              <input
                type="text"
                className="input-field"
                placeholder="Person name"
                value={labelName}
                onChange={(event) => setLabelName(event.target.value)}
                required
              />
              <input
                type="text"
                className="input-field"
                placeholder="Relationship"
                value={labelRelationship}
                onChange={(event) => setLabelRelationship(event.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-400 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-500"
              >
                Save Label
              </button>
            </form>
            <button
              type="button"
              onClick={() => setSelectedAlert(null)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </Card>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-20 z-40 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

