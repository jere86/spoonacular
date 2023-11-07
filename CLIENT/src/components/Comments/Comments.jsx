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
      <p>{comment.text}</p>
      {user._id === comment.userId && (
        <button onClick={() => onDelete(comment.id)}>Delete</button>
      )}
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
      await axios.patch(`http://localhost:5000/images/${imagesetId}`, {
        comments: comments,
      });
    };
    patchData();
  }, [comments, imagesetId]);

  return (
    <div className="container">
      <h3>Comment</h3>
      <CommentForm onCommentSubmit={handleCommentSubmit} />
      <div className="comments">
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
