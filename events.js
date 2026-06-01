// ============================================
// HOW TO ADD EVENTS
//
// ONE-TIME events (pop-ups, festivals, private):
//   {
//     name: "Event Name",
//     date: "YYYY-MM-DD",
//     time: "10am – 3pm",
//     location: "City, WA",
//     type: "Pop-Up"
//   }
//
// WEEKLY RECURRING markets (farmers markets):
//   {
//     name: "Market Name",
//     recurring: "weekly",
//     dayOfWeek: 0,          ← 0=Sunday 1=Monday 2=Tue 3=Wed 4=Thu 5=Friday 6=Saturday
//     startDate: "YYYY-MM-DD",
//     endDate:   "YYYY-MM-DD",
//     time: "12pm – 5pm",
//     location: "City, WA",
//     type: "Farmers Market"
//   }
//
// Types: "Farmers Market", "Pop-Up", "Festival", "Private", "Catering"
// ============================================

const events = [

  // --- WEEKLY RECURRING MARKETS ---

  {
    name: "Normandy Park Farmers Market",
    recurring: "weekly",
    dayOfWeek: 0,              // Sunday
    startDate: "2026-04-26",
    endDate:   "2026-11-30",
    time: "12pm – 5pm",
    location: "Normandy Park, WA",
    type: "Farmers Market"
  },

  {
    name: "Kent Farmers Market",
    recurring: "weekly",
    dayOfWeek: 6,              // Saturday
    startDate: "2026-06-14",
    endDate:   "2026-10-17",
    time: "10am – 3pm",
    location: "Kent, WA",
    type: "Farmers Market"
  },

  // --- ONE-TIME EVENTS ---

  {
    name: "Urban League REVIVAL Juneteenth Market",
    date: "2026-06-14",
    time: "12pm – 5pm",
    location: "Seattle, WA",
    type: "Pop-Up"
  },

  // Add more one-time events below:
  // {
  //   name: "Your Event Name",
  //   date: "2026-07-04",
  //   time: "10am – 4pm",
  //   location: "Seattle, WA",
  //   type: "Festival"
  // },

];

// ============================================
// Rendering — no need to edit below this line
// ============================================

const typeTagClass = {
  "Farmers Market": "tag-green",
  "Pop-Up":         "tag-coral",
  "Festival":       "tag-coral",
  "Private":        "tag-dark",
  "Catering":       "tag-dark"
};

// Expands a recurring event into individual dated entries
function expandEvent(event) {
  if (!event.recurring) return [event];

  if (event.recurring === 'weekly') {
    const results = [];
    const end = new Date(event.endDate + 'T00:00:00');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from whichever is later: the event's start date or today
    let current = new Date(event.startDate + 'T00:00:00');
    if (current < today) current = new Date(today);

    // Advance to the correct day of the week
    while (current.getDay() !== event.dayOfWeek) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      // Build YYYY-MM-DD without timezone shifting
      const y   = current.getFullYear();
      const mo  = String(current.getMonth() + 1).padStart(2, '0');
      const d   = String(current.getDate()).padStart(2, '0');
      results.push({
        name:     event.name,
        date:     `${y}-${mo}-${d}`,
        time:     event.time,
        location: event.location,
        type:     event.type
      });
      current.setDate(current.getDate() + 7);
    }
    return results;
  }

  return [event];
}

function renderEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Expand recurring events, filter past dates, sort ascending
  const upcoming = events
    .flatMap(expandEvent)
    .filter(e => new Date(e.date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (upcoming.length === 0) {
    container.innerHTML = `
      <p class="no-events">
        No upcoming events scheduled yet — check back soon!<br>
        Follow us on Instagram <a href="https://instagram.com/lalaslemonadewa" target="_blank" rel="noopener">@lalaslemonadewa</a> for the latest.
      </p>`;
    return;
  }

  container.innerHTML = upcoming.map(event => {
    const date     = new Date(event.date + 'T00:00:00');
    const month    = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day      = date.getDate();
    const tagClass = typeTagClass[event.type] || 'tag-green';

    return `
      <div class="event-card">
        <div class="event-date-badge">
          <span class="evt-month">${month}</span>
          <span class="evt-day">${day}</span>
        </div>
        <div class="event-info">
          <h3>${event.name}</h3>
          <p class="event-meta">📍 ${event.location}<br>⏰ ${event.time}</p>
          <span class="tag ${tagClass}">${event.type}</span>
        </div>
      </div>`;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderEvents);
