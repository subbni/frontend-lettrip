import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";

import { getMyProfile } from "../../Service/MyPageService";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

import { RxCross2 } from "react-icons/rx";
import styles from "./Chat.module.css";

function ChatContainer() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.listHeader}>
          <h2 className={styles.headerText}>채팅</h2>
        </div>
        <div className={styles.chatHeader}>
          <img className={styles.headerImg} src={anonymous_profile} />
          <p className={styles.headerNickname}>닉네임</p>

          <p className={styles.headerBtn}>
            <RxCross2 className={styles.headerIcon} />
          </p>
        </div>
      </div>
      <div className={styles.contaner}>
        <div className={styles.listContainer}>
          <div className={styles.chatRoomList}>
            <p className={styles.listProfile}>
              <img className={styles.profileImg} src={anonymous_profile} />
            </p>
            <div className={styles.listInfo}>
              <p className={styles.listNickname}>닉네임</p>
              <p className={styles.listLastContent}>마지막 채팅 내용</p>
            </div>
            <p className={styles.listLastTime}>08:02</p>
          </div>
        </div>
        <div className={styles.chatContainer}>
          <div className={styles.chatRoomContent}>
            <div className={styles.chatBox}>
              <img className={styles.chatProfileImg} src={anonymous_profile} />
              <p className={styles.chatMessage}>
                안녕하세요! 반가워요 엥 이거 왜 사라짐 ?
              </p>
              <p className={styles.chatCreatedTime}>08:02</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
