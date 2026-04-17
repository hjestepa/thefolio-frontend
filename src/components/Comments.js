// frontend/src/components/Comments.js
import { useState, useEffect, useCallback } from 'react';
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
      console.error('Error adding comment:', err);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
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
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            required
            rows="3"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid var(--border-color)',
              borderRadius: '5px',
              marginBottom: '10px',
              fontFamily: 'inherit',
              background: 'var(--card-bg)',
              color: 'var(--text-dark)'
            }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p style={{ color: 'var(--text-medium)', marginBottom: '30px' }}>
          <a href="/login" style={{ color: 'var(--primary)' }}>Login</a> to leave a comment
        </p>
      )}
      
      {comments.length === 0 ? (
        <p style={{ color: 'var(--text-medium)' }}>No comments yet. Be the first to comment!</p>
      ) : (
        <div>
          {comments.map(comment => (
            <div
              key={comment.id}
              style={{
                borderBottom: '1px solid var(--border-color)',
                padding: '15px 0',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <strong style={{ color: 'var(--primary)' }}>
                  {comment.author_name || 'Unknown User'}
                </strong>
                <small style={{ color: 'var(--text-medium)' }}>
                  {new Date(comment.created_at).toLocaleDateString()}
                  {canDelete(comment) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        fontSize: '12px'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </small>
              </div>
              <p style={{ margin: '8px 0', lineHeight: '1.5', color: 'var(--text-dark)' }}>{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Comments;