import { Header } from '@/Components/Header';
import Authenticated from '@/Layouts/AuthenticatedLayout';

const messages = {
  back: 'go back',
  title: 'The quick brown fox jumps over the lazy dog.',
};

export default function Show(data) {
  console.log({ data });

  return (
    <Authenticated header={<Header {...messages} />}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
      quasi numquam necessitatibus obcaecati architecto cumque nam cum libero
      eveniet cupiditate deserunt autem vitae, porro dolore inventore dicta
      perferendis, animi voluptatibus?
    </Authenticated>
  );
}
