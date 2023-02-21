$(document).ready(() => {
    $('.delete-task').on('click', (e) => {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/todo/delete/' + id,
            success: (response) => {
                alert('Deleting Todo');
                window.location.href='/';
            },
            error: (err) => {
                console.log(err);
            }
        })
    });
});