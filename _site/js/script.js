function sortBooks(tag) {
    const books = document.querySelectorAll('.book');
    
    books.forEach(book => {
        const tags = book.getAttribute('data-tags').split(' ');

        if (tag === 'all' || tags.includes(tag)) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}
