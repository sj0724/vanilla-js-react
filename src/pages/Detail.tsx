import { history } from '@/lib/router';

const DetailPage = () => {
  const params = history.getPageParams();
  const page = Number(params);
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
      &nbsp;&nbsp;
      <a data-link href={`/detail/${page + 1}`}>
        go Detail {page + 1}
      </a>
    </div>
  );
};

export default DetailPage;
