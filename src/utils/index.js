import merge from 'lodash/merge';
import pick from 'lodash/pick';
import uniqueId from 'lodash/uniqueId';
import upperFirst from 'lodash/upperFirst';

const toQueryString = obj => Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

const addListener = (target, eventName, handler) => {
    if (typeof handler === 'function') target.on(eventName, handler);
};

/**
 * 获取当前Box盒子
 */
const getBox = (x, y, width, height) => {
    const x1 = (x + width) < x ? (x + width) : x
    const x2 = (x + width) > x ? (x + width) : x
    const y1 = (y + height) < y ? (y + height) : y
    const y2 = (y + height) > y ? (y + height) : y
    return {
        x1, x2, y1, y2
    }
}

/**
 * 判断当前是否处于Box中
 */
const isInBBox = (point, bbox) => {
    const {
        x,
        y
    } = point;
    const {
        minX,
        minY,
        maxX,
        maxY
    } = bbox;
    return x < maxX && x > minX && y > minY && y < maxY;
};

export {
    merge,
    pick,
    toQueryString,
    uniqueId,
    upperFirst,
    addListener,
    getBox,
    isInBBox
};