import MyPostList from "./MyPostList";
import MyPokeList from "./MyPokeList";
import styles from "./Poke.module.css";

const PokeContainer = () => {
  return (
    <div className={styles.page}>
      <MyPostList />
      <MyPokeList />
    </div>
  );
};

export default PokeContainer;
