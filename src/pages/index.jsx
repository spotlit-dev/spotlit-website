import React, { useMemo } from 'react';
import { useTranslations } from 'use-intl';

import { getSpots } from '~/repositories/SpotRepository';

import ItemsGrid from '~/components/partials/item/ItemsGrid';
import HeaderSimple from '~/components/shared/headers/HeaderSimple';
import Container from '~/components/layouts/Container';

const PAGE_SIZE = 9;

export async function getServerSideProps({ locale = 'en' }) {
  const queryParams = {
    sort: 'createdAt:desc',
    limit: PAGE_SIZE,
    start: 0,
    locale,
  };
  const spotsData = await getSpots({ ...queryParams, where: { isValidated: true } });

  return {
    props: {
      ...spotsData,
      messages: {
        ...require(`../messages/common/${locale}.json`),
        ...require(`../messages/list/${locale}.json`),
      },
    },
  };
}

const Index = ({ spots }) => {
  const t = useTranslations('Index');
  const collections = useMemo(
    () => [
      {
        title: t('Recently Added Spots'),
        items: spots,
        type: 'spot',
        icon: 'feather icon icon-map-pin',
      },
    ],
    [spots, t]
  );

  return (
    <Container
      title="Homepage"
      header={<HeaderSimple className="header--simple" />}
    >
      <main id="homepage-grid">
        <div style={{ backgroundImage: `url(/static/img/spotlit-app.jpg)`, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', height: '75vh', backgroundPosition: 'center'}}>
          <h3 style={{textTransform: 'uppercase', textAlign: 'center', margin: '30px'}}>Book the best spot in town</h3>
        </div>
        {collections.map(({ title, items, type, icon }, i) => (
          <section
            key={title}
            className={`ps-collection${i % 2 === 0 ? '--highlight' : ''}`}
            style={{padding: 30}}
          >
            <div className="container">
              <div className="ps-section__header">
                <h3 className="ps-heading ps-heading--with-icon white">
                  <i className={icon}></i>
                  {title}
                </h3>
              </div>
              <div className="ps-section__content">
                <ItemsGrid items={items} columns={3} type={type} />
              </div>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
};

export default Index;
