import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; //overlay 라이브러리 사용하기
import {
  createPoke,
  deletePoke,
  showAllPokesInMeetUpPost,
} from "../../Service/PokeService";
import { createChatRoom } from "../../Service/ChatService";
import styles from "./PostDetail.module.css";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import {
  PiGenderFemaleBold,
  PiGenderMaleBold,
  PiHandTap,
} from "react-icons/pi"; //성별 아이콘, 클릭 아이콘

function Poke({ id }) {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]); //찌른 사람들 정보 가져오기
  const [peopleImg, setPeopleImg] = useState([]); //찌른 사람들 3명까지 정보가져오기
  const [showAllPokes, setShowAllPokes] = useState(false); //찌른 사람들 정보 보기 (modal설정)
  const [modalIsOpen, setModalIsOpen] = useState(false); //modal 설정
  const [pokeForm, setPokeForm] = useState({
    meetUpPostId: id,
    briefMessage: "",
  }); //쿡 찌르기 요청 보낼 때
  const [chatRoomForm, setChatRoomForm] = useState({
    meetUpPostId: id,
    writeUserId: "",
    requestUserId: "",
  }); //채팅방 개설 요청 보낼 때
  const [isPoked, setIsPoked] = useState(false); //쿡 찌르기 상태 저장

  useEffect(() => {
    fetchShowAllPokes();
    /*
    const maxPeopleToShow = 3;
    // 현재 상태에서 최대 3명까지의 정보를 복사하여 peopleImg 상태를 업데이트
    setPeopleImg(people.slice(0, maxPeopleToShow)); */
  }, []);

  //쿡 찌르기 전체 조회 (useEffect 돌려서 프로필 사진, 수 체크하기)
  const fetchShowAllPokes = () => {
    showAllPokesInMeetUpPost(id)
      .then((response) => {
        console.log(response.content);
        setPeople(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  //쿡 찌르기 전체 목록 조회
  const onClickShowAllPokes = (e) => {
    e.preventDefault();
    setShowAllPokes(true);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  //쿡 찌르기 버튼 누르기
  const onClickCreatePoke = (e) => {
    e.preventDefault();
    createPoke(pokeForm)
      .then((response) => {
        console.log(response);
        window.alert("쿡 찔렀습니다!");
        setIsPoked(true);
        closeModal(); // 쿡 찌르기 후 모달 닫기
        console.log(pokeForm);
      })
      .catch((e) => {
        console.log(e);
        window.alert("쿡 찌르기에 실패했습니다. 다시 시도해주세요.");
      });
  };

  //쿡 찌르기 취소 버튼 누르기
  const onClickDeletePoke = (e) => {
    e.preventDefault();
    if (window.confirm("쿸 찌르기 요청을 취소하시겠습니까?")) {
      deletePoke(id)
        .then((response) => {
          console.log(response);
          console.log(id);
          window.alert("다음에 다시 만나요!");
          setIsPoked(false);
        })
        .catch((e) => {
          console.log(e);
          window.alert("쿡 찌르기에 실패했습니다. 다시 시도해주세요.");
        });
    }
  };

  //찌르기 수락 -> 채팅방 개설
  const onClickMeetUpPoke = (e) => {
    e.preventDefault();
    console.log("찌르기 요청 수락");
    if (window.confirm("쿸 찌르기 요청을 수락하시겠습니까?")) {
      const newChatRoomForm = {
        meetUpPostId: id,
        writeUserId: 22,
        requestUserId: 123,
      };
      createChatRoom(newChatRoomForm)
        .then((response) => {
          console.log(response);
          window.alert("채팅방이 개설되었습니다!");
          setShowAllPokes(false);
        })
        .catch((e) => {
          console.log(e);
          window.alert("요청 수락에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className={styles.pokeContainer}>
      {isPoked ? (
        <PiHandTap className={styles.pokeIcon} onClick={openModal} />
      ) : (
        <PiHandTap className={styles.isPokedIcon} onClick={onClickDeletePoke} />
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            maxWidth: "400px",
            maxHeight: "220px",
            margin: "auto",
            padding: "0px 35px",
          },
        }}
      >
        <h2 className={styles.pokeTitle}>쿡 찌르기</h2>
        <textarea
          value={pokeForm.briefMessage}
          onChange={(e) =>
            setPokeForm({ ...pokeForm, briefMessage: e.target.value })
          }
          placeholder='원하는 멘트를 입력하세요!'
          className={styles.pokeBriefMsg}
        />
        <div className={styles.pokeBtnContainer}>
          <button className={styles.pokeCreateBtn} onClick={onClickCreatePoke}>
            찌르기
          </button>
          <button className={styles.pokeCancelBtn} onClick={closeModal}>
            취소
          </button>
        </div>
      </Modal>
      <div className={styles.pokeImgContainer}>
        <img
          className={styles.pokeImg01}
          src={peopleImg[0]?.profile_picture || anonymous_profile}
          alt='Profile 0'
        />
        <img
          className={styles.pokeImg02}
          src={peopleImg[1]?.profile_picture || anonymous_profile}
          alt='Profile 1'
        />
        <img
          className={styles.pokeImg03}
          src={peopleImg[2]?.profile_picture || anonymous_profile}
          alt='Profile 2'
        />
      </div>
      <p className={styles.pokePeopleCount} onClick={onClickShowAllPokes}>
        {people.length}명이 쿡 찔렀습니다.
      </p>
      <Modal
        isOpen={showAllPokes}
        onRequestClose={() => setShowAllPokes(false)}
        style={{
          content: {
            maxWidth: "630px",
            margin: "auto",
            padding: "30px 35px",
          },
        }}
      >
        <div>
          <button
            className={styles.pokeCloseBtn}
            onClick={() => setShowAllPokes(false)}
          >
            x
          </button>
          <h2 className={styles.pokeCount}>
            {people.length}명이 쿡 찔렀습니다.
          </h2>
          <div className={styles.pokePeopleContainer}>
            {people.map((person, index) => (
              <div key={person.id} className={styles.pokeItem}>
                <div className={styles.pokeHeader}>
                  <img
                    className={styles.pokeProfile}
                    src={person.profile_picture || anonymous_profile}
                    alt={`Profile ${index}`}
                  />
                  <div className={styles.pokePeopleInfoContent01}>
                    <p className={styles.pokeName}>
                      {person.name} ({person.nickname})
                    </p>
                    <div className={styles.pokePeopleInfoContent02}>
                      <p className={styles.pokeAge}>{person.birthDate}세</p>
                      <p className={styles.pokeSex}>
                        {person.sex === "male" ? (
                          <PiGenderMaleBold className={styles.maleIcon} />
                        ) : (
                          <PiGenderFemaleBold className={styles.femaleIcon} />
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <p className={styles.pokeMessage}>{person.briefMessage}</p>
                <button
                  className={styles.meetUpPokeBtn}
                  onClick={onClickMeetUpPoke}
                >
                  수락
                </button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Poke;
