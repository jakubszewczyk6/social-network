document.querySelectorAll('.profile-info p').forEach(p => {
    if(innerWidth < 340 && p.textContent.length > 18) {
        p.textContent = p.textContent.substr(0, 18) + '...';
    }
})

const icons = document.querySelectorAll('.follow-icon');
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

icons.forEach(icon => {
    
    icon.addEventListener('click', async () => {
        if(!icon.dataset.userId) {
            return;
        }

        const res = await fetch('/follow', {
            body: `userID=${icon.dataset.userId}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'CSRF-Token': token
            },
            method: 'POST'
        })

        if(res.ok) {
            const message = await res.text();

            if(message === 'added') {
                icon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-check-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                    <span class="follow-status" style="color: green;">Dodano</span>
                `
            }

            if(message === 'removed') {
                icon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    </svg>
                    <span class="follow-status" style="color: red;">Usunięto</span>
                `
            }
        }
    })
})