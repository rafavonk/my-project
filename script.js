// Event data with seating configurations
const events = {
    event1: {
        name: 'Summer Music Festival',
        price: 75,
        rows: 10,
        seatsPerRow: 10,
        occupied: ['1-2', '3-5', '5-7', '7-8'] // Example of pre-occupied seats
    },
    event2: {
        name: 'Broadway Show',
        price: 120,
        rows: 10,
        seatsPerRow: 10,
        occupied: ['2-3', '4-4', '6-6', '8-9'] // Example of pre-occupied seats
    }
};

let currentEvent = null;
let selectedSeats = [];

// Modal handling
const modal = document.getElementById('seating-modal');
const closeBtn = document.getElementsByClassName('close')[0];
const seatingMap = document.getElementById('seating-map');
const selectedSeatsElement = document.getElementById('selected-seats');
const totalPriceElement = document.getElementById('total-price');
const bookButton = document.getElementById('book-tickets');

closeBtn.onclick = () => {
    modal.style.display = 'none';
    selectedSeats = [];
    updateBookingSummary();
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        selectedSeats = [];
        updateBookingSummary();
    }
};

function showSeatingMap(eventId) {
    currentEvent = events[eventId];
    if (!currentEvent) return;

    // Clear previous selections
    selectedSeats = [];
    updateBookingSummary();

    // Show modal
    modal.style.display = 'block';

    // Generate seating map
    generateSeatingMap();
}

function generateSeatingMap() {
    seatingMap.innerHTML = '';
    
    for (let row = 1; row <= currentEvent.rows; row++) {
        for (let seat = 1; seat <= currentEvent.seatsPerRow; seat++) {
            const seatElement = document.createElement('div');
            const seatId = `${row}-${seat}`;
            
            seatElement.classList.add('seat');
            if (currentEvent.occupied.includes(seatId)) {
                seatElement.classList.add('occupied');
            } else {
                seatElement.classList.add('available');
            }
            
            seatElement.setAttribute('data-seat', seatId);
            seatElement.onclick = () => toggleSeat(seatElement, seatId);
            
            seatingMap.appendChild(seatElement);
        }
    }
}

function toggleSeat(seatElement, seatId) {
    if (seatElement.classList.contains('occupied')) return;

    const seatIndex = selectedSeats.indexOf(seatId);
    if (seatIndex === -1) {
        // Select seat
        selectedSeats.push(seatId);
        seatElement.classList.remove('available');
        seatElement.classList.add('selected');
    } else {
        // Unselect seat
        selectedSeats.splice(seatIndex, 1);
        seatElement.classList.remove('selected');
        seatElement.classList.add('available');
    }

    updateBookingSummary();
}

function updateBookingSummary() {
    selectedSeatsElement.textContent = selectedSeats.length > 0 
        ? selectedSeats.join(', ') 
        : 'None';
    
    const total = selectedSeats.length * currentEvent?.price || 0;
    totalPriceElement.textContent = total.toFixed(2);
}

// Book tickets button handler
bookButton.onclick = () => {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }

    // In a real application, this would connect to a backend to process the booking
    alert(`Booking confirmed!\nEvent: ${currentEvent.name}\nSeats: ${selectedSeats.join(', ')}\nTotal: $${(selectedSeats.length * currentEvent.price).toFixed(2)}`);
    
    // Update occupied seats
    currentEvent.occupied.push(...selectedSeats);
    
    // Close modal and reset selections
    modal.style.display = 'none';
    selectedSeats = [];
    updateBookingSummary();
};

// Add hover effect to show seat numbers
seatingMap.addEventListener('mouseover', (e) => {
    const seat = e.target;
    if (seat.classList.contains('seat')) {
        const seatId = seat.getAttribute('data-seat');
        seat.setAttribute('title', `Seat ${seatId}`);
    }
});
