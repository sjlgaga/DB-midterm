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

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');

    function loadComments() {
        fetch(`/api/getComments/${shopId}`)
        .then(response => response.json())
        .then(comments => {
            const commentsList = document.getElementById('commentsList');
            commentsList.innerHTML = ''; // 清空当前内容
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.className = 'comment-item';
                commentDiv.innerHTML = `<strong>${comment.Username}</strong>: ${comment.Content}`;
                commentsList.appendChild(commentDiv);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    window.submitComment = function() {
        const username = document.getElementById('usernameInput').value;
        const content = document.getElementById('commentInput').value;
        if (!username || !content) {
            alert('用户名和评论内容不能为空！');
            return;
        }
        fetch(`/api/addComment/${shopId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: username, Content: content })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('评论添加成功！');
                loadComments();  // 重新加载评论列表
                usernameInput.value = '';
                commentInput.value = '';
            } else {
                alert('评论添加失败：' + result.message);
            }
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    loadComments();  // 初始加载评论
});
