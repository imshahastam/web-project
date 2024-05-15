document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('mood-form');
    const dateInput = document.getElementById('date');
    const noteInput = document.getElementById('note');
    const selectedEntryDiv = document.getElementById('selected-entry');
    const historyDiv = document.getElementById('history');
    const clearButton = document.getElementById('clear-history');
    let selectedMood = '';

    const moodButtons = document.querySelectorAll('.mood');
    moodButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedMood = button.id.replace('mood_', '');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const date = dateInput.value;
        const note = noteInput.value;

        if (!date || !selectedMood || !note) {
            alert('Пожалуйста, заполните все поля и выберите настроение.');
            return;
        }

        const entry = { date, mood: selectedMood, note };
        saveEntry(entry);
        displayEntryByDate(date);
        displayHistory();
    });

    dateInput.addEventListener('change', () => {
        const date = dateInput.value;
        displayEntryByDate(date);
    });

    clearButton.addEventListener('click', () => {
        localStorage.removeItem('moodEntries');
        displayHistory();
        selectedEntryDiv.innerHTML = '<p>Нет записи за выбранную дату.</p>';
    });

    function saveEntry(entry) {
        let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        const existingEntryIndex = entries.findIndex(e => e.date === entry.date);
        if (existingEntryIndex !== -1) {
            entries[existingEntryIndex] = entry;
        } else {
            entries.push(entry);
        }
        localStorage.setItem('moodEntries', JSON.stringify(entries));
    }

    function displayEntryByDate(date) {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        const entry = entries.find(e => e.date === date);
        if (entry) {
            displaySelectedEntry(entry);
        } else {
            selectedEntryDiv.innerHTML = '<p>Нет записи за выбранную дату.</p>';
        }
    }

    function displaySelectedEntry(entry) {
        const moodMap = {
            '1': 'Отлично',
            '2': 'Хорошо',
            '3': 'Нормально',
            '4': 'Плохо',
            '5': 'Ужасно'
        };

        selectedEntryDiv.innerHTML = `
            <p><strong>Дата:</strong> ${entry.date}</p>
            <p><strong>Настроение:</strong> ${moodMap[entry.mood]}</p>
            <p><strong>Заметка:</strong> ${entry.note}</p>
        `;

        moodButtons.forEach(btn => btn.classList.remove('selected'));
        const selectedBtn = document.getElementById(`mood_${entry.mood}`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
    }

    function displayHistory() {
        const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
        historyDiv.innerHTML = '';

        if (entries.length === 0) {
            historyDiv.innerHTML = '<p>История настроений пуста.</p>';
            return;
        }

        entries.forEach(entry => {
            const moodClass = `mood_${entry.mood}`;
            const entryDiv = document.createElement('div');
            entryDiv.className = `entry ${moodClass}`;
            entryDiv.innerHTML = `
                <p><strong>Дата:</strong> ${entry.date}</p>
                <p><strong>Настроение:</strong> ${entry.mood}</p>
                <p><strong>Заметка:</strong> ${entry.note}</p>
            `;
            historyDiv.appendChild(entryDiv);
        });
    }

    displayHistory();
});
