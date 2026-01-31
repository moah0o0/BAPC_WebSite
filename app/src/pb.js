import PocketBase from 'pocketbase';
import config from './config';

const pb = new PocketBase(config.API_URL);

// 자동 요청 취소 비활성화 - 컴포넌트 언마운트 시 요청이 취소되는 문제 방지
pb.autoCancellation(false);

export default pb;
