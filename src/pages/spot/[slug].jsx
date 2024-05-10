import React, { useMemo } from 'react';

import { getSpotBySlug, getSpotReviews } from '~/repositories/SpotRepository';

import HeaderSimple from '~/components/shared/headers/HeaderSimple';
import Container from '~/components/layouts/Container';
import ItemDetailWithHero from '~/components/elements/items/ItemDetailWithHero';

export async function getServerSideProps({ query: { slug }, locale }) {
  const spot = await getSpotBySlug(slug, locale);
  const { reviews } = await getSpotReviews(spot.id, {
    after: 20,
  });


  if (spot.isValidated === false) {
    console.log('spot is validated', spot.isValidated)
    return {
      notFound: true,
    };
  }

  return {
    props: {
      spot,
      reviews,
      messages: {
        ...require(`../../messages/common/${locale}.json`),
        ...require(`../../messages/detail/${locale}.json`),
      },
    },
  };
}

const SpotDetailScreen = ({ spot, reviews }) => {
  const breadcrumb = useMemo(
    () => [
      {
        text: 'Home',
        url: '/',
      },
      {
        text: 'Spots',
        url: '/spot',
      },
      {
        text: spot ? spot.title : 'Spot detail',
      },
    ],
    [spot]
  );

  return (
    <Container
      header={<HeaderSimple className="header--simple" />}
      title={spot.title}
      description={spot.shortDesc}
      thumbnail={spot.thumbnail}
    >
      <main className="ps-page ps-page--blog">
        <main className="ps-page ps-page--single-post">
          <ItemDetailWithHero item={spot} comments={reviews} />
        </main>
      </main>
    </Container>
  );
};

export default SpotDetailScreen;
