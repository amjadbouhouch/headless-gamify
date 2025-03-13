import { HeadlessGamify } from '../index';

const gamify = new HeadlessGamify({
  API_BASE_URL: 'http://localhost:3000',
  API_KEY: 'B99683F3-1456CACE-56371890-D685B31C-1101F428-0C132514-20641C3D-815A4291',
});

function RewardScenario() {}

// try {

//   const response = await gamify.rewards.claimReward({
//     rewardId: '2a5dba70-3681-4a22-9380-785443ad7353',
//     userId: '2b80350a-c8f8-40e0-aa4f-c814dd4c8d0d',
//   });
//   console.log(response.data);
// } catch (error) {
//   if (isAxiosError(error)) {
//     console.log(error.response?.data);
//   }
// }
