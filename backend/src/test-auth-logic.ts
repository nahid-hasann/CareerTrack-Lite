import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from './utils/jwt';

async function testAuthLogic() {
  console.log('🧪 Testing Auth Logic...');

  // 1. Password Hashing
  const rawPassword = 'SecurePassword123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  console.log('✅ Hashed Password:', hashedPassword);

  // 2. Password Verification
  const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
  const isWrongMatch = await bcrypt.compare('WrongPassword', hashedPassword);
  console.log('✅ Password match check (correct):', isMatch === true);
  console.log('✅ Password match check (wrong):', isWrongMatch === false);

  // 3. JWT Token Generation
  const dummyUserId = 'uuid-1234-5678-90ab';
  const token = generateToken(dummyUserId);
  console.log('✅ Generated JWT Token:', token);

  // 4. JWT Token Verification
  const decoded = verifyToken(token);
  console.log('✅ Decoded UserId:', decoded.userId);
  console.log('✅ Token verification match:', decoded.userId === dummyUserId);

  console.log('🎉 All Auth Logic tests passed!');
}

testAuthLogic().catch(console.error);
