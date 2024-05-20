document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');
    // 封装加载评论列表的函数
    function loadComments() {
        fetch(`/api/getComments/${shopId}`)
            .then(response => response.json())
            .then(comments => {
                const commentsList = document.getElementById('commentsList');
                commentsList.innerHTML = ''; // 清空当前内容
                comments.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.className = 'comment-item'; // 使用相应的CSS类
                    commentDiv.innerHTML = `<strong>${comment.Username}</strong>: ${comment.Content}`;
                    commentsList.appendChild(commentDiv);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // 页面加载时加载评论
    loadComments();
});
