import {format, formatDistance} from 'date-fns';
import {en} from 'date-fns/locale';

const formatDate = (date, formatStr = 'PP', locale = en) => {
  return format(date, formatStr, {
    locale,
  });
};
const timeSince = (date, locale = en) => {
  return formatDistance(new Date(date), new Date(), {addSuffix: true, locale});
};

export {formatDate, timeSince};
