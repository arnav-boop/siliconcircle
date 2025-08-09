// forum.js - basic frontend for forum API

const API = 'http://localhost:5000/api';
let currentSubreddit = null;

function getToken() {
  return localStorage.getItem('forum_token');
}


function renderPosts(posts) {
  const postsDiv = document.getElementById('forum-posts');
  postsDiv.innerHTML = '';
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'forum-post';
    postDiv.innerHTML = `
      <div class="forum-post-title">${post.title}</div>
      <div class="forum-post-body">${post.body}</div>
      <div class="forum-post-meta">By ${post.author?.username || 'Unknown'} | Upvotes: ${post.upvotes} <button onclick=\"upvotePost('${post._id}')\">▲</button> <span style='font-size:0.9em;color:#33ff33;'>in r/${post.subreddit?.name || 'general'}</span></div>
      <div><button onclick=\"showCommentForm('${post._id}')\">Comment</button></div>
      <div id="comments-${post._id}"></div>
      <div id="comment-form-${post._id}" style="display:none;">
        <textarea id="comment-input-${post._id}" placeholder="Add a comment..."></textarea>
        <button onclick=\"submitComment('${post._id}')\">Submit</button>
      </div>
    `;
    postsDiv.appendChild(postDiv);
    loadComments(post._id);
  });
}


async function loadPosts() {
  let url = `${API}/posts`;
  if (currentSubreddit) url += `?subreddit=${encodeURIComponent(currentSubreddit)}`;
  const res = await fetch(url);
  const posts = await res.json();
  renderPosts(posts);
}

async function upvotePost(id) {
  await fetch(`${API}/posts/${id}/upvote`, {
    method: 'POST',
    headers: { 'Authorization': getToken() }
  });
  loadPosts();
}

function showCommentForm(postId) {
  document.getElementById(`comment-form-${postId}`).style.display = 'block';
}

async function submitComment(postId) {
  const body = document.getElementById(`comment-input-${postId}`).value;
  await fetch(`${API}/comments/${postId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    },
    body: JSON.stringify({ body })
  });
  loadComments(postId);
}

async function loadComments(postId) {
  const res = await fetch(`${API}/posts/${postId}`);
  const post = await res.json();
  const commentsDiv = document.getElementById(`comments-${postId}`);
  commentsDiv.innerHTML = '';
  post.comments.forEach(comment => {
    const cDiv = document.createElement('div');
    cDiv.className = 'forum-comment';
    cDiv.textContent = `${comment.author?.username || 'Unknown'}: ${comment.body}`;
    commentsDiv.appendChild(cDiv);
  });
}

document.getElementById('post-form').addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  await fetch(`${API}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    },
    body: JSON.stringify({ title, body })
  });
  document.getElementById('post-form').reset();
  loadPosts();
});


// Subreddit logic
async function loadSubreddits() {
  const res = await fetch(`${API}/subreddits`);
  const subs = await res.json();
  const select = document.getElementById('subreddit-select');
  select.innerHTML = '';
  subs.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.name;
    opt.textContent = `r/${sub.name}`;
    select.appendChild(opt);
  });
  if (subs.length > 0) {
    currentSubreddit = subs[0].name;
    select.value = currentSubreddit;
  } else {
    currentSubreddit = null;
  }
  loadPosts();
}

document.getElementById('subreddit-select').addEventListener('change', function() {
  currentSubreddit = this.value;
  loadPosts();
});

document.getElementById('create-subreddit-btn').addEventListener('click', function() {
  document.getElementById('subreddit-modal').style.display = 'flex';
});

document.getElementById('close-subreddit-modal').addEventListener('click', function() {
  document.getElementById('subreddit-modal').style.display = 'none';
});

document.getElementById('subreddit-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('subreddit-name').value;
  const description = document.getElementById('subreddit-desc').value;
  await fetch(`${API}/subreddits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken()
    },
    body: JSON.stringify({ name, description })
  });
  document.getElementById('subreddit-modal').style.display = 'none';
  document.getElementById('subreddit-form').reset();
  loadSubreddits();
});

window.onload = loadSubreddits;
