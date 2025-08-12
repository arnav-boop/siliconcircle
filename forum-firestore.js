// forum-firestore.js - Firebase Firestore implementation for forum
let currentSubreddit = null;
let currentUser = null;

// Initialize Firebase Auth state listener
auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    loadSubreddits();
  } else {
    // Redirect to login if not authenticated
    window.location.href = 'auth.html';
  }
});

// Firestore references
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const subredditsCollection = db.collection('subreddits');

function renderPosts(posts) {
  const postsDiv = document.getElementById('forum-posts');
  postsDiv.innerHTML = '';
  
  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'forum-post';
    
    // Format post data
    const authorName = post.author?.displayName || post.author?.email || 'Unknown';
    const subredditName = post.subreddit?.name || 'general';
    
    postDiv.innerHTML = `
      <div class="forum-post-title">${post.title}</div>
      <div class="forum-post-body">${post.body}</div>
      <div class="forum-post-meta">By ${authorName} | Upvotes: ${post.upvotes || 0} 
        <button onclick="upvotePost('${post.id}')">▲</button> 
        <span style='font-size:0.9em;color:#33ff33;'>in r/${subredditName}</span>
      </div>
      <div>
        <button onclick="showCommentForm('${post.id}')">Comment</button>
      </div>
      <div id="comments-${post.id}"></div>
      <div id="comment-form-${post.id}" style="display:none;">
        <textarea id="comment-input-${post.id}" placeholder="Add a comment..."></textarea>
        <button onclick="submitComment('${post.id}')">Submit</button>
      </div>
    `;
    
    postsDiv.appendChild(postDiv);
    loadComments(post.id);
  });
}

async function loadPosts() {
  try {
    let query = postsCollection.orderBy('createdAt', 'desc');
    
    if (currentSubreddit) {
      query = query.where('subreddit.name', '==', currentSubreddit);
    }
    
    const snapshot = await query.get();
    const posts = [];
    
    snapshot.forEach(doc => {
      posts.push({ id: doc.id, ...doc.data() });
    });
    
    renderPosts(posts);
  } catch (error) {
    console.error('Error loading posts:', error);
    alert('Failed to load posts. Please try again.');
  }
}

async function upvotePost(postId) {
  try {
    const postRef = postsCollection.doc(postId);
    await postRef.update({
      upvotes: firebase.firestore.FieldValue.increment(1)
    });
    
    // Reload posts to show updated count
    loadPosts();
  } catch (error) {
    console.error('Error upvoting post:', error);
    alert('Failed to upvote post. Please try again.');
  }
}

function showCommentForm(postId) {
  document.getElementById(`comment-form-${postId}`).style.display = 'block';
}

async function submitComment(postId) {
  try {
    const body = document.getElementById(`comment-input-${postId}`).value;
    
    if (!body.trim()) {
      alert('Comment cannot be empty');
      return;
    }
    
    await commentsCollection.add({
      postId: postId,
      body: body,
      author: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email
      },
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Clear form and reload comments
    document.getElementById(`comment-input-${postId}`).value = '';
    loadComments(postId);
  } catch (error) {
    console.error('Error submitting comment:', error);
    alert('Failed to submit comment. Please try again.');
  }
}

async function loadComments(postId) {
  try {
    const snapshot = await commentsCollection
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc')
      .get();
      
    const commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.innerHTML = '';
    
    snapshot.forEach(doc => {
      const comment = doc.data();
      const authorName = comment.author?.displayName || comment.author?.email || 'Unknown';
      
      const cDiv = document.createElement('div');
      cDiv.className = 'forum-comment';
      cDiv.textContent = `${authorName}: ${comment.body}`;
      commentsDiv.appendChild(cDiv);
    });
  } catch (error) {
    console.error('Error loading comments:', error);
  }
}

document.getElementById('post-form').addEventListener('submit', async e => {
  e.preventDefault();
  
  if (!currentUser) {
    alert('You must be logged in to post');
    return;
  }
  
  const title = document.getElementById('post-title').value;
  const body = document.getElementById('post-body').value;
  
  if (!title.trim() || !body.trim()) {
    alert('Title and body cannot be empty');
    return;
  }
  
  try {
    await postsCollection.add({
      title: title,
      body: body,
      author: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email
      },
      subreddit: currentSubreddit ? { name: currentSubreddit } : null,
      upvotes: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Reset form and reload posts
    document.getElementById('post-form').reset();
    loadPosts();
  } catch (error) {
    console.error('Error creating post:', error);
    alert('Failed to create post. Please try again.');
  }
});

// Subreddit logic
async function loadSubreddits() {
  try {
    const snapshot = await subredditsCollection.orderBy('name').get();
    const subs = [];
    
    snapshot.forEach(doc => {
      subs.push({ id: doc.id, ...doc.data() });
    });
    
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
  } catch (error) {
    console.error('Error loading subreddits:', error);
    alert('Failed to load subreddits. Please try again.');
  }
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
  
  if (!currentUser) {
    alert('You must be logged in to create a subreddit');
    return;
  }
  
  const name = document.getElementById('subreddit-name').value;
  const description = document.getElementById('subreddit-desc').value;
  
  if (!name.trim()) {
    alert('Subreddit name cannot be empty');
    return;
  }
  
  try {
    await subredditsCollection.add({
      name: name,
      description: description || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email
      }
    });
    
    document.getElementById('subreddit-modal').style.display = 'none';
    document.getElementById('subreddit-form').reset();
    loadSubreddits();
  } catch (error) {
    console.error('Error creating subreddit:', error);
    alert('Failed to create subreddit. Please try again.');
  }
});