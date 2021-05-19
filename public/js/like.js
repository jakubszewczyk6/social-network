const likes = document.querySelectorAll('.like');
const likesNumber = document.querySelectorAll('.like-number');
const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

likes.forEach(like => {
    like.addEventListener('click', async () => {
        const res = await fetch('/like', {
            body: `postID=${like.dataset.postid}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'CSRF-Token': token
            },
            method: 'POST'
        });

        const response = await res.text();

        like.innerHTML = '<svg class="like" data-postID="<%= post._id %>" enable-background="new 0 0 512 512" viewBox="0 0 512 512" style="visibility: visible;"><path d="m376 28.535c-54.55 0-95.02 33.5-120 81.02-24.98-47.52-65.46-81.02-120-81.02-78.6 0-136 66-136 146.52 0 89.92 72.43 151.51 182.07 244.75 57.78 49.13 63.12 54.3 73.93 63.66 11.17-9.66 16.02-14.42 73.92-63.66 109.65-93.24 182.08-154.83 182.08-244.75 0-80.51-57.39-146.52-136-146.52z" fill="#ff637b"/><path d="m512 175.055c0 89.92-72.43 151.51-182.08 244.75-57.9 49.24-62.75 54-73.92 63.66v-373.91c24.98-47.52 65.45-81.02 120-81.02 78.61 0 136 66.01 136 146.52z" fill="#e63950"/></svg>';
        likesNumber.forEach(likeNumber => {
            if(likeNumber.dataset.postid === like.dataset.postid) {
                likeNumber.textContent = response;
            }
        })
    })
})