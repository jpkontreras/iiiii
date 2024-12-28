import { cn } from '@/lib/utils';
import Details from './Details';
import Modifiers from './Modifiers';

const styles = {
  wrapper: cn('size-full grid grid-cols-2 gap-x-4 bg-gray-50 p-4'),
  details: cn('bg-white rounded-lg'),
  modifiers: cn('bg-white rounded-lg'),
};

function MenuItemDetails() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.details}>
        <Details />
      </div>
      <div className={styles.modifiers}>
        <Modifiers />
      </div>
    </div>
  );
}

export default MenuItemDetails;
