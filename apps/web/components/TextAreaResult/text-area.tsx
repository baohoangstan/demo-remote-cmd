import { useEffect, useRef } from 'react';
import styles from './text-area.module.less';

const TextArea = ({ value }: { value: string }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [value]);
  return (
    <textarea
      className={styles['text-area']}
      ref={ref}
      value={value}
      onChange={() => null}
    ></textarea>
  );
};

export default TextArea;
