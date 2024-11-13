import { Header } from '@/Components/Header';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const messages = {
  back: 'go back',
  title: 'The quick brown fox jumps over the lazy dog.',
};

export default function RestaurantIndex(data) {
  return <Authenticated header={<Header {...messages} />}></Authenticated>;
}
