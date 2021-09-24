import {format} from 'date-fns';
import {fi} from 'date-fns/locale';

const formatDate = (date, formatStr = 'PP', locale = fi) => {
  return format(date, formatStr, {
    locale,
  });
};

export {formatDate};
