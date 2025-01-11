import { history } from '@/lib/router';

const DetailPage = () => {
  const params = history.getPageParams();
  return (
    <div>
      <h2>Detail {params}</h2>
      <a data-link href='/'>
        go Main
      </a>
      &nbsp;&nbsp;
      <a data-link href='/dashboard'>
        go DashBoard
      </a>
    </div>
  );
};

export default DetailPage;
