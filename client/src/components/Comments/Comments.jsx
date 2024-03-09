import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { v4 } from "uuid";

import styles from "./Comments.module.scss";
import { AppContext } from "../../context/appContext";

const CommentForm = ({ onCommentSubmit }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCommentSubmit(commentText);
    setCommentText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write your comment..."
        required
      />
      <button type="submit">Submit Comment</button>
    </form>
  );
};

const Comment = ({ comment, onDelete, user }) => {
  return (
    <div className={styles.comment}>
      <p className={styles.username}>
        <b>{comment.username}</b> wrote:
      </p>
      <div className={styles.commenttext}>
        <p>{comment.text}</p>
        {user._id === comment.userId && (
          <button onClick={() => onDelete(comment.id)}>Delete</button>
        )}
      </div>
    </div>
  );
};

const Comments = ({ commentList, imagesetId }) => {
  const { currentUser } = useContext(AppContext);
  const [comments, setComments] = useState(commentList && commentList);

  const handleCommentSubmit = (text) => {
    const newComment = {
      id: v4(),
      text: text,
      userId: currentUser._id,
      username: currentUser.username,
    };
    setComments([...comments, newComment]);
  };

  const handleCommentDelete = (commentId) => {
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
  };

  useEffect(() => {
    const patchData = async () => {
      await axios.patch(
        `https://spoonacular-api.vercel.app/images/${imagesetId}`,
        {
          comments: comments,
        }
      );
    };
    patchData();
  }, [comments, imagesetId]);

  return (
    <div className="container">
      <h3>Comment</h3>
      <CommentForm onCommentSubmit={handleCommentSubmit} />
      <div className="comments-list">
        {comments.map((comment, index) => (
          <Comment
            key={index}
            user={currentUser}
            comment={comment}
            onDelete={handleCommentDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments;
