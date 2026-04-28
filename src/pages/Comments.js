import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/comments/${postId}`, { body: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  const canDelete = (comment) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.id === comment.author_id) return true;
    return false;
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
      <h3>Comments ({comments.length})</h3>
      {user ? (
        <form onSubmit={handleSubmit}>
          <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment..." rows="3" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
          <button type="submit" disabled={submitting}>{submitting ? 'Posting...' : 'Post Comment'}</button>
        </form>
      ) : (
        <p><a href="/login">Login</a> to leave a comment</p>
      )}
      {comments.map(comment => (
        <div key={comment.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '15px 0' }}>
          <div><strong>{comment.author_name}</strong> <small>{new Date(comment.created_at).toLocaleDateString()}</small>
            {canDelete(comment) && <button onClick={() => handleDelete(comment.id)} style={{ marginLeft: '10px', background: 'none', color: 'var(--danger)' }}>Delete</button>}
          </div>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}

export default Comments;