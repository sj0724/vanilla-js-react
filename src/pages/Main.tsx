import { useState } from '@/lib/dom';

const MainPage = () => {
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onclick={handleButtonClick}>버튼</button>
      <p>{count}</p>
      <p>test</p>
    </div>
  );
};

export default MainPage;
