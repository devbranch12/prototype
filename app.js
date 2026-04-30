const app = document.getElementById('app');

const pets = [
  {
    id: 'max',
    name: 'Max',
    breed: 'Golden Retriever',
    age: '5 Years',
    owner: 'Emily Carter',
    clinic: 'Happy Tails Animal Clinic',
    issue: 'Excessive scratching',
    allergies: 'Pollen',
    medication: 'Apoquel',
    dose: '16 mg, 1 tablet daily',
    nextRefill: '7/25/2024',
    weight: '78 lbs',
    note: 'Friendly, energetic, and due for a routine checkup.',
    color: '#d9a85f',
  },
  {
    id: 'bella',
    name: 'Bella',
    breed: 'Labrador',
    age: '3 Years',
    owner: 'Emily Carter',
    clinic: 'Happy Tails Animal Clinic',
    issue: 'Vaccination due',
    allergies: 'None noted',
    medication: 'N/A',
    dose: 'Annual vaccines only',
    nextRefill: 'N/A',
    weight: '64 lbs',
    note: 'Calm temperament, ready for annual boosters.',
    color: '#c9a07a',
  },
  {
    id: 'charlie',
    name: 'Charlie',
    breed: 'Beagle',
    age: '2 Years',
    owner: 'Emily Carter',
    clinic: 'Happy Tails Animal Clinic',
    issue: 'Follow-up',
    allergies: 'Chicken',
    medication: 'Probiotic chew',
    dose: '1 chew daily',
    nextRefill: '8/08/2024',
    weight: '28 lbs',
    note: 'Needs a quick follow-up after his last visit.',
    color: '#c18b63',
  },
];

const schedule = [
  { time: '2:30 PM', pet: 'Max', reason: 'Checkup', owner: 'Emily Carter', status: 'Ready' },
  { time: '3:00 PM', pet: 'Bella', reason: 'Vaccination', owner: 'Emily Carter', status: 'Arriving' },
  { time: '3:30 PM', pet: 'Charlie', reason: 'Follow-up', owner: 'Emily Carter', status: 'Waiting' },
];

const screens = [
  { id: 'patient-dashboard', label: 'Dashboard', nav: 'Patient' },
  { id: 'book-appointment', label: 'Book Appointment', nav: 'Patient' },
  { id: 'date-time', label: 'Date & Time', nav: 'Patient' },
  { id: 'pet-info', label: 'Pet Info', nav: 'Patient' },
  { id: 'visit-summary', label: 'Visit Summary', nav: 'Patient' },
  { id: 'reception-dashboard', label: 'Reception', nav: 'Clinic' },
  { id: 'check-in', label: 'Check-In', nav: 'Clinic' },
  { id: 'check-in-complete', label: 'Complete', nav: 'Clinic' },
];

const modes = {
  patient: {
    label: 'Patient View',
    defaultScreen: 'patient-dashboard',
    screens: ['patient-dashboard', 'book-appointment', 'date-time', 'visit-summary'],
    theme: 'Patient',
  },
  receptionist: {
    label: 'Receptionist View',
    defaultScreen: 'reception-dashboard',
    screens: ['reception-dashboard', 'check-in', 'check-in-complete'],
    theme: 'Receptionist',
  },
  vetTech: {
    label: 'Vet Tech View',
    defaultScreen: 'pet-info',
    screens: ['pet-info', 'visit-summary'],
    theme: 'Vet Tech',
  },
};

const steps = [
  { n: 1, label: 'Pet' },
  { n: 2, label: 'Service' },
  { n: 3, label: 'Date & Time' },
  { n: 4, label: 'Confirm' },
];

const state = {
  mode: 'patient',
  screen: 'patient-dashboard',
  transitionDirection: 1,
  selectedPetId: 'max',
  selectedDate: 25,
  selectedTime: '2:30 PM',
  selectedService: 'Routine Checkup',
  checkedIn: {
    contact: true,
    insurance: false,
    history: true,
    medication: false,
  },
  notes: 'Please call Emily if the visit runs long. Max is happy with food rewards.',
};

let keyboardNavigationBound = false;

const icons = {
  home: icon(
    'M4 11.5 12 5l8 6.5M6.5 10.5V19h11v-8.5M9.5 19v-5h5v5',
  ),
  calendar: icon('M5 6.5h14M7 4.5v4m10-4v4M5.5 8.5h13v11h-13z'),
  paw: icon('M7 9.5c0 1-.7 1.8-1.6 1.8S4 10.5 4 9.5s.7-1.8 1.6-1.8S7 8.4 7 9.5Zm5-2.1c0 1.2-.8 2.1-1.7 2.1s-1.7-.9-1.7-2.1.8-2.1 1.7-2.1 1.7.9 1.7 2.1Zm5 2.1c0 1-.7 1.8-1.6 1.8s-1.6-.8-1.6-1.8.7-1.8 1.6-1.8 1.6.8 1.6 1.8Zm-8 5.3c-.9 0-1.7-.9-1.7-2.1s.8-2.1 1.7-2.1 1.7.9 1.7 2.1-.8 2.1-1.7 2.1Zm2.6 2.4c-1.6 0-2.9-1.2-2.9-2.8s1.3-2.8 2.9-2.8 2.9 1.2 2.9 2.8-1.3 2.8-2.9 2.8Z'),
  messages: icon('M5 6h14v10H8l-3 3V6zm3 4h8M8 12h5'),
  user: icon('M12 11.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Zm-6.5 7c1.2-3 3.8-4.6 6.5-4.6s5.3 1.6 6.5 4.6'),
  help: icon('M12 17v.2m0-4.7a2.4 2.4 0 1 0-2.4-2.4'),
  logout: icon('M10 6.5H6.5A1.5 1.5 0 0 0 5 8v8A1.5 1.5 0 0 0 6.5 17.5H10m2.5-9 2.5 2.5-2.5 2.5M12 12H5'),
  chevron: icon('M9 6.5 14.5 12 9 17.5'),
  spark: icon('M12 3.5 13.8 8l4.6 1.8-4.6 1.8L12 16l-1.8-4.4-4.6-1.8L10.2 8 12 3.5Zm6.5 9.7.9 2.2 2.3.9-2.3.9-.9 2.2-.9-2.2-2.3-.9 2.3-.9.9-2.2Z'),
  bell: icon('M12 18.5c1 0 1.8-.8 1.8-1.8h-3.6c0 1 .8 1.8 1.8 1.8ZM16 14H8c1-1 1.3-2.2 1.3-3.8 0-2.6 1.4-4.7 2.7-4.7s2.7 2.1 2.7 4.7c0 1.6.3 2.8 1.3 3.8Z'),
  mail: icon('M5.5 7.2h13v9.6h-13z M6 7.5l6 4.9 6-4.9'),
  search: icon('M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm8.5 15.5-4.4-4.4'),
  clipboard: icon('M9 6.5h6m-5-2h4c.6 0 1 .4 1 1v1H8v-1c0-.6.4-1 1-1Zm-1 4h8v9H8z'),
  check: icon('M6.5 12.3 10 15.8 17.5 8.3'),
  plus: icon('M12 6.5v11m-5.5-5.5h11'),
  print: icon('M7.5 8V4.5h9V8m-10 2H6.5A1.5 1.5 0 0 0 5 11.5v4h3v3h8v-3h3v-4a1.5 1.5 0 0 0-1.5-1.5h-1'),
  send: icon('M5 12 19 5l-4 14-3.2-5.2L5 12Zm10.8-7.2-6.8 8.6'),
  refill: icon('M6.5 8.5h11M7.5 5.5h9v13h-9zM9 11h6'),
  note: icon('M7.5 5.5h9v13h-9zM10 8h5M10 11h5M10 14h3'),
};

function icon(pathData) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${pathData}" /></svg>`;
}

function petById(id) {
  return pets.find((pet) => pet.id === id) || pets[0];
}

function petAvatarStyle(pet) {
  const fill = pet.color;
  return `background-image: radial-gradient(circle at 38% 34%, #ffe8c4 0 20%, transparent 20.8%), radial-gradient(circle at 32% 30%, #6e4024 0 4%, transparent 4.5%), radial-gradient(circle at 52% 30%, #6e4024 0 4%, transparent 4.5%), radial-gradient(circle at 42% 50%, #c97d53 0 5%, transparent 5.5%), radial-gradient(circle at 36% 58%, ${fill} 0 10%, transparent 10.5%), radial-gradient(circle at 58% 58%, ${fill} 0 10%, transparent 10.5%), linear-gradient(135deg, #d7ecff, #f5f8fc)`;
}

function shell(content) {
  const mode = modes[state.mode] || modes.patient;
  const visibleScreens = screens.filter((screen) => mode.screens.includes(screen.id));
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="logo-mark">
          <span class="badge">${icons.paw}</span>
          <span>PawFlow</span>
        </div>
        <div class="nav-group">
          <div class="nav-label">${mode.theme}</div>
          ${visibleScreens.map((screen) => navButton(screen.id, screen.label, navIconFor(screen.id))).join('')}
        </div>
        <div class="nav-footer">
          <button class="nav-button" data-screen="patient-dashboard">${wrapIcon('help')}${'Help'}</button>
          <button class="nav-button" data-screen="reception-dashboard">${wrapIcon('logout')}${'Log Out'}</button>
        </div>
      </aside>
      <div class="workspace">
        ${topbar()}
        <main class="content">
          <section class="view view-animate view-${state.transitionDirection > 0 ? 'forward' : 'backward'} ${state.screen === 'patient-dashboard' || state.screen === 'reception-dashboard' ? '' : 'single'}">
            ${content}
          </section>
        </main>
      </div>
    </div>
  `;
}

function topbar() {
  const mode = modes[state.mode] || modes.patient;
  const visibleScreens = screens.filter((screen) => mode.screens.includes(screen.id));
  const suggestedScreen = getSuggestedScreen(mode, state.screen);
  return `
    <header class="topbar">
      <div class="topbar-header">
        <div class="mode-switch" role="tablist" aria-label="Workspace modes">
          ${Object.entries(modes)
            .map(([key, value]) => {
              const active = state.mode === key ? 'active' : '';
              return `<button class="mode-button ${active}" data-mode="${key}" role="tab" aria-selected="${state.mode === key}">${value.label}</button>`;
            })
            .join('')}
        </div>
        <div class="topbar-meta">
          <span class="pill">${wrapIcon('paw')} ${mode.theme}</span>
          <span class="pill">${wrapIcon('mail')}</span>
          <span class="avatar-mini" style="${avatarStyle('#8da8c6')}"></span>
        </div>
      </div>
      <div class="topbar-pages">
        <div class="mode-shortcuts">
          <button class="shortcut-button" data-nav="prev" ${visibleScreens.length < 2 ? 'disabled' : ''}>
            ${wrapIcon('chevron')}
            <span>Back</span>
          </button>
          <button class="shortcut-button suggested" data-screen="${suggestedScreen.id}">
            ${wrapIcon('spark')}
            <span>Suggested: ${suggestedScreen.label}</span>
          </button>
        </div>
        <div class="pages-panel">
          <span class="pages-label">Pages</span>
          <div class="screen-strip">
            ${visibleScreens.map((screen) => screenButton(screen)).join('')}
          </div>
        </div>
      </div>
    </header>
  `;
}

function navButton(screenId, label, iconMarkup) {
  const active = state.screen === screenId ? 'active' : '';
  return `
    <button class="nav-button ${active}" data-screen="${screenId}">
      <span class="icon">${iconMarkup}</span>
      <span>${label}</span>
    </button>
  `;
}

function navIconFor(screenId) {
  if (screenId === 'patient-dashboard' || screenId === 'reception-dashboard') {
    return icons.home;
  }

  if (screenId === 'book-appointment' || screenId === 'date-time') {
    return icons.calendar;
  }

  if (screenId === 'pet-info') {
    return icons.paw;
  }

  if (screenId === 'visit-summary') {
    return icons.messages;
  }

  if (screenId === 'check-in' || screenId === 'check-in-complete') {
    return icons.check;
  }

  return icons.user;
}

function getSuggestedScreen(mode, currentScreenId) {
  const suggestions = {
    patient: {
      'patient-dashboard': 'book-appointment',
      'book-appointment': 'date-time',
      'date-time': 'visit-summary',
      'visit-summary': 'patient-dashboard',
    },
    receptionist: {
      'reception-dashboard': 'check-in',
      'check-in': 'check-in-complete',
      'check-in-complete': 'reception-dashboard',
    },
    vetTech: {
      'pet-info': 'visit-summary',
      'visit-summary': 'pet-info',
    },
  };

  const modeKey = Object.keys(modes).find((key) => modes[key] === mode) || 'patient';
  const suggestedId = suggestions[modeKey]?.[currentScreenId] || mode.defaultScreen;
  return screens.find((screen) => screen.id === suggestedId) || screens.find((screen) => screen.id === mode.defaultScreen) || screens[0];
}

function screenButton(screen) {
  const active = state.screen === screen.id ? 'active' : '';
  return `<button class="screen-button ${active}" data-screen="${screen.id}">${screen.label}</button>`;
}

function wrapIcon(name) {
  return `<span class="icon">${icons[name]}</span>`;
}

function avatarStyle(color) {
  return `background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), transparent 26%), linear-gradient(135deg, ${color}, #dce8f4);`;
}

function dogAvatarMarkup(pet) {
  return `<div class="pet-avatar" style="${petAvatarStyle(pet)}"></div>`;
}

function patientDashboard() {
  const pet = petById(state.selectedPetId);
  return shell(`
    <div class="left-panel stack">
      <div class="panel soft">
        <div class="panel-header">
          <h1 class="panel-title">Welcome, Triv!</h1>
          <p class="panel-subtitle">A calm, functional prototype for booking, records, and clinic check-in.</p>
        </div>
        <div class="card hero-card">
          <div class="hero-art"></div>
          <div class="hero-content">
            <div class="hero-headline">
              <h2>Welcome back, Triv.</h2>
              <p>${pet.name} is ready for a routine checkup.</p>
            </div>
            <div class="hero-actions">
              <button class="primary-button" data-screen="book-appointment">${wrapIcon('calendar')} Book Appointment</button>
              <button class="secondary-button" data-screen="pet-info">${wrapIcon('clipboard')} View Records</button>
              <button class="secondary-button" data-screen="visit-summary">${wrapIcon('messages')} Messages</button>
            </div>
            <div class="hero-name">${pet.name}</div>
          </div>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Upcoming Appointment</h3>
          <span class="pill">${wrapIcon('calendar')} Thursday, April 25</span>
        </div>
        <div class="appointment-card" style="margin-top: 14px;">
          ${dogAvatarMarkup(pet)}
          <div>
            <div class="pet-name">${pet.name}</div>
            <div class="pet-meta">Routine Checkup</div>
            <div class="pet-meta">Happy Tails Animal Clinic</div>
          </div>
          <div>
            <div class="pet-name" style="text-align: right;">2:30 PM</div>
            <div class="pet-meta" style="text-align: right;">View Details</div>
          </div>
        </div>
      </div>
    </div>

    <div class="right-panel stack">
      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Quick Actions</h3>
          <span class="pill">${wrapIcon('plus')} Fast lane</span>
        </div>
        <div class="quick-actions" style="margin-top: 12px;">
          <button class="quick-action" data-screen="book-appointment">
            <span>
              <strong>Book New Appointment</strong>
              <small>Walk through pet, service, and date selection.</small>
            </span>
            ${wrapIcon('chevron')}
          </button>
          <button class="quick-action" data-screen="visit-summary">
            <span>
              <strong>Request Prescription Refill</strong>
              <small>Review medications and submit a refill request.</small>
            </span>
            ${wrapIcon('chevron')}
          </button>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Today at a Glance</h3>
          <span class="pill">${wrapIcon('note')} 3 items</span>
        </div>
        <div class="detail-grid" style="margin-top: 12px;">
          <div class="detail"><strong>Checkup</strong><span>2:30 PM</span></div>
          <div class="detail"><strong>Medication</strong><span>Apoquel refill</span></div>
          <div class="detail"><strong>Status</strong><span>Confirmed</span></div>
          <div class="detail"><strong>Clinic</strong><span>Happy Tails</span></div>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Messages</h3>
          <span class="pill">${wrapIcon('messages')} Clinic</span>
        </div>
        <div class="info-row">
          <div>
            <strong>Reminder from Happy Tails</strong>
            <div class="pet-meta">Please arrive 10 minutes early for check-in.</div>
          </div>
          <span class="status-dot"></span>
        </div>
      </div>
    </div>
  `);
}

function bookAppointment() {
  const pet = petById(state.selectedPetId);
  return shell(`
    <div class="full-panel panel soft pad">
      <div class="card-title-row">
        <div>
          <h2 class="card-title serif">Book an Appointment</h2>
          <div class="panel-subtitle">A guided flow with persistent choices and next-step actions.</div>
        </div>
        <span class="pill">${wrapIcon('calendar')} Step 1 of 4</span>
      </div>
      <div class="stepper" style="margin-top: 16px;">
        ${steps.map((step) => `<div class="step ${step.n === 1 ? 'active' : ''}"><div class="bubble">${step.n}</div>${step.label}</div>`).join('')}
      </div>

      <div style="margin-top: 22px;">
        <h3 class="section-title">Select a Pet</h3>
        <div class="pet-grid" style="margin-top: 14px;">
          ${pets.map(renderPetCard).join('')}
        </div>
      </div>

      <div class="progress-actions">
        <button class="ghost-button" data-screen="patient-dashboard">${wrapIcon('chevron')} Back</button>
        <button class="primary-button" data-screen="date-time">Next ${wrapIcon('chevron')}</button>
      </div>
    </div>
  `);
}

function renderPetCard(pet) {
  const active = pet.id === state.selectedPetId ? 'selected' : '';
  return `
    <button class="pet-select-card ${active}" data-action="select-pet" data-pet-id="${pet.id}">
      ${dogAvatarMarkup(pet)}
      <div class="meta">
        <p class="name">${pet.name}</p>
        <p>${pet.breed}</p>
        <p>${pet.age}</p>
      </div>
      ${pet.id === state.selectedPetId ? '<span class="pill">Selected</span>' : '<span class="pill">Choose</span>'}
    </button>
  `;
}

function dateTimeScreen() {
  const pet = petById(state.selectedPetId);
  const days = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return shell(`
    <div class="full-panel panel soft pad">
      <div class="card-title-row">
        <div>
          <h2 class="card-title serif">Select Date &amp; Time</h2>
          <div class="panel-subtitle">Choose the day and slot that fit the visit best.</div>
        </div>
        <span class="pill">${wrapIcon('calendar')} Step 3 of 4</span>
      </div>
      <div class="stepper" style="margin-top: 16px;">
        ${steps.map((step) => `<div class="step ${step.n === 3 ? 'active' : ''}"><div class="bubble">${step.n}</div>${step.label}</div>`).join('')}
      </div>

      <div class="card pad" style="margin-top: 22px;">
        <div class="info-head">
          ${dogAvatarMarkup(pet)}
          <div>
            <div class="pet-name">${pet.name}</div>
            <div class="pet-meta">${pet.breed}</div>
          </div>
        </div>
        <div class="calendar-layout" style="margin-top: 16px;">
          <div class="calendar-shell">
            <div class="calendar-head">
              <button class="ghost-button" aria-label="Previous month">←</button>
              <h3>April 2024</h3>
              <button class="ghost-button" aria-label="Next month">→</button>
            </div>
            <div class="calendar-grid">
              ${weekDays.map((day) => `<div class="weekday">${day}</div>`).join('')}
              ${days
                .map((day) => {
                  const selected = day === state.selectedDate ? 'selected' : '';
                  const available = [25, 26, 27, 28, 29].includes(day) ? 'available' : 'muted';
                  return `<button class="day-cell ${selected} ${available}" data-action="select-date" data-date="${day}">${day}</button>`;
                })
                .join('')}
            </div>
          </div>
          <div class="side-actions">
            <div class="calendar-shell">
              <h3 class="section-title">Available Times</h3>
              <div class="time-list" style="margin-top: 12px;">
                ${['9:00 AM', '10:30 AM', '2:30 PM', '4:00 PM', '5:00 PM']
                  .map((time) => `<button class="time-button ${time === state.selectedTime ? 'selected' : ''}" data-action="select-time" data-time="${time}">${time}</button>`)
                  .join('')}
              </div>
            </div>
            <div class="note-text">Selected: ${selectedDateLabel(state.selectedDate)} at ${state.selectedTime}</div>
          </div>
        </div>
      </div>

      <div class="progress-actions">
        <button class="ghost-button" data-screen="book-appointment">${wrapIcon('chevron')} Back</button>
        <button class="primary-button" data-screen="visit-summary">Next ${wrapIcon('chevron')}</button>
      </div>
    </div>
  `);
}

function selectedDateLabel(date) {
  const month = 'April';
  return `${month} ${date}, 2024`;
}

function petInfoScreen() {
  const pet = petById(state.selectedPetId);
  return shell(`
    <div class="left-panel stack">
      <div class="card pad">
        <div class="info-head">
          ${dogAvatarMarkup(pet)}
          <div>
            <h2 class="card-title serif" style="margin: 0;">${pet.name}</h2>
            <div class="pill" style="margin-top: 8px;">${wrapIcon('note')} ${pet.clinic}</div>
          </div>
        </div>
        <div class="kpi-grid" style="margin-top: 16px;">
          <div class="kpi"><span class="compact-label">Weight</span><strong>${pet.weight}</strong></div>
          <div class="kpi"><span class="compact-label">Age</span><strong>${pet.age}</strong></div>
          <div class="kpi"><span class="compact-label">Breed</span><strong>${pet.breed}</strong></div>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Health Summary</h3>
          <span class="pill">${wrapIcon('chevron')}</span>
        </div>
        <div class="summary-box" style="margin-top: 12px;">
          <div class="info-row">
            <div>
              <strong>Current Issue</strong>
              <div class="pet-meta">${pet.issue}</div>
            </div>
            <span class="status-dot"></span>
          </div>
          <div class="info-row">
            <div>
              <strong>Known Allergies</strong>
              <div class="pet-meta">${pet.allergies}</div>
            </div>
            <span class="pill">Review</span>
          </div>
          <div class="info-row" style="border-bottom: 0; padding-bottom: 0;">
            <div>
              <strong>Visit History</strong>
              <div class="pet-meta">Routine checkup, vaccination follow-up, and medication review.</div>
            </div>
            <span class="pill">3 visits</span>
          </div>
        </div>
      </div>
    </div>

    <div class="right-panel stack">
      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Medication</h3>
          <span class="pill">${wrapIcon('refill')} Active</span>
        </div>
        <div class="info-card" style="margin-top: 12px;">
          <div class="info-head">
            <div class="pet-avatar" style="${avatarStyle('#7ca7c8')}"></div>
            <div>
              <div class="pet-name">${pet.medication}</div>
              <div class="pet-meta">${pet.dose}</div>
            </div>
          </div>
          <div class="info-row">
            <div>
              <strong>Next refill</strong>
              <div class="pet-meta">${pet.nextRefill}</div>
            </div>
            <button class="secondary-button" data-screen="visit-summary">Request Refill</button>
          </div>
          <button class="primary-button" data-screen="visit-summary">Open Visit Summary</button>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Notes</h3>
          <span class="pill">${wrapIcon('note')} Care</span>
        </div>
        <div class="note-text" style="margin-top: 12px;">${pet.note}</div>
      </div>
    </div>
  `);
}

function visitSummaryScreen() {
  const pet = petById(state.selectedPetId);
  return shell(`
    <div class="full-panel panel soft pad">
      <div class="card-title-row">
        <div>
          <h2 class="card-title serif">Visit Summary</h2>
          <div class="panel-subtitle">Records and summary share the same data so the prototype behaves consistently.</div>
        </div>
        <div class="tag-row">
          <span class="pill">Records</span>
          <span class="pill">Visit Summary</span>
        </div>
      </div>

      <div class="summary-layout" style="margin-top: 18px;">
        <div class="card pad">
          <div class="summary-top">
            ${dogAvatarMarkup(pet)}
            <div>
              <h3 class="card-title serif" style="margin: 0;">${pet.name}</h3>
              <div class="pet-meta">${pet.clinic}</div>
              <div class="pill" style="margin-top: 10px;">${wrapIcon('calendar')} ${selectedDateLabel(state.selectedDate)} - ${state.selectedTime}</div>
            </div>
            <button class="secondary-button">Email Summary</button>
          </div>
        </div>

        <div class="split-grid">
          <div class="stack">
            <div class="card pad">
              <h3 class="card-title">Diagnosis</h3>
              <div class="detail" style="margin-top: 12px;">
                <strong>${pet.issue}</strong>
                <div class="pet-meta">Known Allergies: ${pet.allergies}</div>
              </div>
            </div>

            <div class="card pad">
              <div class="card-title-row">
                <h3 class="card-title">Medications</h3>
                <span class="pill">${wrapIcon('refill')} Refill</span>
              </div>
              <div class="detail" style="margin-top: 12px;">
                <strong>${pet.medication}</strong>
                <div class="pet-meta">${pet.dose}</div>
                <div class="note-text" style="margin-top: 8px;">Please administer as prescribed and monitor scratching for the next 7 days.</div>
              </div>
            </div>
          </div>

          <div class="card pad">
            <h3 class="card-title">Message the Clinic</h3>
            <textarea class="message-input" readonly>${state.notes}</textarea>
            <div class="footer-actions" style="margin-top: 12px;">
              <button class="ghost-button">Save Draft</button>
              <button class="primary-button">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function receptionDashboard() {
  return shell(`
    <div class="left-panel stack">
      <div class="card hero-card" style="min-height: 290px; background: linear-gradient(135deg, #7f9fc1, #a7c2df 56%, #d8e5f0 110%);">
        <div class="hero-art" style="opacity: 0.92;"></div>
        <div class="hero-content">
          <div class="hero-headline">
            <h2>Welcome, Emily!</h2>
            <p>Reception dashboard with one-click patient check-in.</p>
          </div>
          <div class="hero-actions">
            <button class="primary-button" data-screen="check-in">${wrapIcon('check')} Check-In Patient</button>
            <button class="secondary-button" data-screen="visit-summary">${wrapIcon('clipboard')} View Schedule</button>
            <button class="secondary-button">${wrapIcon('search')} Search Records</button>
          </div>
          <div class="hero-name">Front Desk</div>
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Current Appointment</h3>
          <span class="pill">${wrapIcon('calendar')} 2:30 PM</span>
        </div>
        <div class="appointment-card" style="margin-top: 14px;">
          ${dogAvatarMarkup(petById('max'))}
          <div>
            <div class="pet-name">Max</div>
            <div class="pet-meta">Emily Carter</div>
            <div class="pet-meta">Veterinary Checkup</div>
          </div>
          <div class="side-actions">
            <button class="primary-button" data-screen="check-in">Check-In Patient</button>
            <button class="secondary-button">View Schedule</button>
          </div>
        </div>
      </div>
    </div>

    <div class="right-panel stack">
      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Today’s Schedule</h3>
          <span class="pill">${wrapIcon('calendar')} 3 visits</span>
        </div>
        <div class="list" style="margin-top: 12px;">
          ${schedule.map(renderScheduleItem).join('')}
        </div>
      </div>

      <div class="card pad">
        <div class="card-title-row">
          <h3 class="card-title">Reception Notes</h3>
          <span class="pill">${wrapIcon('note')}</span>
        </div>
        <div class="note-text" style="margin-top: 12px;">All arrivals automatically sync from the patient dashboard selection for this prototype.</div>
      </div>
    </div>
  `);
}

function renderScheduleItem(item) {
  return `
    <div class="schedule-item">
      <div class="time">${item.time}</div>
      <div>
        <strong>${item.pet} · ${item.reason}</strong>
        <div class="pet-meta">${item.owner}</div>
      </div>
      <span class="pill">${item.status}</span>
    </div>
  `;
}

function checkInScreen() {
  const pet = petById('max');
  return shell(`
    <div class="full-panel panel soft pad">
      <div class="card-title-row">
        <div>
          <h2 class="card-title serif">Patient Check-In</h2>
          <div class="panel-subtitle">This screen drives directly into the completion flow when the checklist is done.</div>
        </div>
        <span class="pill">${wrapIcon('check')} In progress</span>
      </div>

      <div class="split-grid" style="margin-top: 18px;">
        <div class="stack">
          <div class="card pad">
            <div class="info-head">
              ${dogAvatarMarkup(pet)}
              <div>
                <div class="pet-name">${pet.name}</div>
                <div class="pet-meta">Owner: ${pet.owner}</div>
                <div class="pet-meta">Breed: ${pet.breed}</div>
              </div>
            </div>
          </div>

          <div class="card pad">
            <h3 class="card-title">Appointment Details</h3>
            <div class="summary-box" style="margin-top: 12px;">
              <div class="info-row"><strong>Thursday, April 25</strong><span></span></div>
              <div class="info-row"><strong>Time</strong><span>${state.selectedTime}</span></div>
              <div class="info-row" style="border-bottom: 0; padding-bottom: 0;"><strong>Reason</strong><span>Routine Checkup</span></div>
            </div>
          </div>
        </div>

        <div class="stack">
          <div class="card pad">
            <h3 class="card-title">Check the Basics</h3>
            <div class="checklist" style="margin-top: 12px;">
              ${checkboxItem('contact', 'Confirm owner contact information')}
              ${checkboxItem('insurance', 'Verify insurance (if applicable)')}
              ${checkboxItem('history', 'Update medical history')}
              ${checkboxItem('medication', 'Confirm current medications')}
            </div>
            <div class="footer-actions" style="margin-top: 14px;">
              <button class="secondary-button" data-screen="reception-dashboard">Edit Information</button>
              <button class="primary-button" data-screen="check-in-complete">Complete Check-In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
}

function checkboxItem(key, label) {
  const checked = state.checkedIn[key] ? 'checked' : '';
  return `
    <label class="check-item">
      <input type="checkbox" data-action="toggle-check" data-check-key="${key}" ${checked} />
      <span>${label}</span>
    </label>
  `;
}

function checkInCompleteScreen() {
  const pet = petById('max');
  return shell(`
    <div class="full-panel panel soft pad" style="max-width: 720px; margin: 0 auto;">
      <div class="card-title-row">
        <div>
          <h2 class="card-title serif">Check-In Complete</h2>
          <div class="panel-subtitle">A final confirmation screen with clear next steps.</div>
        </div>
        <span class="pill">${wrapIcon('check')} Complete</span>
      </div>

      <div class="stack" style="margin-top: 18px;">
        <div class="card pad">
          <div class="info-head">
            ${dogAvatarMarkup(pet)}
            <div>
              <div class="pet-name">${pet.name} has been successfully checked in.</div>
              <div class="pet-meta">Appointment time: ${state.selectedTime}</div>
            </div>
          </div>
        </div>

        <div class="card pad">
          <h3 class="card-title">Appointment Summary</h3>
          <div class="detail-grid" style="margin-top: 12px;">
            <div class="detail"><strong>Time</strong><span>${state.selectedTime}</span></div>
            <div class="detail"><strong>Veterinarian</strong><span>Dr. Smith</span></div>
            <div class="detail"><strong>Email</strong><span>emily.carter@email.com</span></div>
            <div class="detail"><strong>Clinic</strong><span>Happy Tails Animal Clinic</span></div>
          </div>
        </div>

        <div class="card pad">
          <h3 class="card-title">Next Steps</h3>
          <div class="list" style="margin-top: 12px;">
            <div class="info-row"><span>Please have the client take a seat in the waiting area.</span><span class="status-dot"></span></div>
            <div class="info-row"><span>A technician will call them shortly.</span><span class="status-dot"></span></div>
          </div>
          <div class="footer-actions" style="margin-top: 14px;">
            <button class="secondary-button">${wrapIcon('print')} Print Summary</button>
            <button class="primary-button">${wrapIcon('send')} Send Confirmation</button>
          </div>
        </div>
      </div>
    </div>
  `);
}

function render() {
  enforceModeScreen();
  let content = '';
  switch (state.screen) {
    case 'patient-dashboard':
      content = patientDashboard();
      break;
    case 'book-appointment':
      content = bookAppointment();
      break;
    case 'date-time':
      content = dateTimeScreen();
      break;
    case 'pet-info':
      content = petInfoScreen();
      break;
    case 'visit-summary':
      content = visitSummaryScreen();
      break;
    case 'reception-dashboard':
      content = receptionDashboard();
      break;
    case 'check-in':
      content = checkInScreen();
      break;
    case 'check-in-complete':
      content = checkInCompleteScreen();
      break;
    default:
      content = patientDashboard();
  }

  app.innerHTML = content;
  bindInteractions();
}

function enforceModeScreen() {
  const mode = modes[state.mode] || modes.patient;
  if (!mode.screens.includes(state.screen)) {
    state.screen = mode.defaultScreen;
  }
}

function bindInteractions() {
  if (!keyboardNavigationBound) {
    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigatePage(-1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigatePage(1);
      }
    });

    keyboardNavigationBound = true;
  }

  document.querySelectorAll('[data-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      state.transitionDirection = 1;
      state.screen = modes[state.mode]?.defaultScreen || modes.patient.defaultScreen;
      render();
    });
  });

  document.querySelectorAll('[data-nav]').forEach((button) => {
    button.addEventListener('click', () => {
      navigatePage(button.dataset.nav === 'prev' ? -1 : 1);
    });
  });

  document.querySelectorAll('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => {
      const previousScreen = state.screen;
      state.screen = button.dataset.screen;
      const activeMode = Object.entries(modes).find(([, mode]) => mode.screens.includes(state.screen));
      if (activeMode) {
        state.mode = activeMode[0];
      }
      state.transitionDirection = getScreenIndex(state.screen, state.mode) >= getScreenIndex(previousScreen, state.mode) ? 1 : -1;
      render();
    });
  });

  document.querySelectorAll('[data-action="select-pet"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedPetId = button.dataset.petId;
      render();
    });
  });

  document.querySelectorAll('[data-action="select-date"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedDate = Number(button.dataset.date);
      render();
    });
  });

  document.querySelectorAll('[data-action="select-time"]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedTime = button.dataset.time;
      render();
    });
  });

  document.querySelectorAll('[data-action="toggle-check"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      state.checkedIn[checkbox.dataset.checkKey] = checkbox.checked;
    });
  });
}

function navigatePage(direction) {
  const mode = modes[state.mode] || modes.patient;
  const visibleScreens = screens.filter((screen) => mode.screens.includes(screen.id));

  if (visibleScreens.length < 2) {
    return;
  }

  const currentIndex = Math.max(
    0,
    visibleScreens.findIndex((screen) => screen.id === state.screen),
  );
  const nextIndex = (currentIndex + direction + visibleScreens.length) % visibleScreens.length;
  state.transitionDirection = direction >= 0 ? 1 : -1;
  state.screen = visibleScreens[nextIndex].id;
  render();
}

function getScreenIndex(screenId, modeKey) {
  const mode = modes[modeKey] || modes.patient;
  return mode.screens.indexOf(screenId);
}

render();
