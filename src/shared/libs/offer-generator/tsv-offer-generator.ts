import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import {
  MockServerData,
  UserType,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  getRandomBoolean,
} from '../../helpers/index.js';
import {
  CITIES,
  HOUSING_TYPES,
  GOODS,
  CITY_LOCATIONS,
} from '../../constants/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 5000;

const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_PRECISION = 1;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 50;

const MIN_GOODS = 1;
const MAX_GOODS = GOODS.length;

const IMAGES_COUNT = 6;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(CITIES);
    const previewUrl = getRandomItem(this.mockData.previewUrls);
    const imagesUrl = getRandomItems(this.mockData.imageUrls, IMAGES_COUNT);
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, RATING_PRECISION);
    const housingType = getRandomItem(HOUSING_TYPES);
    const roomCount = generateRandomValue(MIN_ROOMS, MAX_ROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems(GOODS, generateRandomValue(MIN_GOODS, MAX_GOODS));

    const authorName = getRandomItem(this.mockData.users);
    const authorEmail = getRandomItem(this.mockData.emails);
    const authorAvatarUrl = getRandomItem(this.mockData.avatars);
    const authorType: UserType = getRandomBoolean() ? 'pro' : 'regular';

    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);

    const location = CITY_LOCATIONS[city];

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      city,
      previewUrl,
      imagesUrl.join('|'),
      isPremium.toString(),
      isFavorite.toString(),
      rating.toString(),
      housingType,
      roomCount.toString(),
      maxAdults.toString(),
      price.toString(),
      goods.join('|'),
      [authorName, authorEmail, authorAvatarUrl, authorType].join('|'),
      commentsCount.toString(),
      [location.latitude, location.longitude].join('|'),
    ].join('\t');
  }
}
