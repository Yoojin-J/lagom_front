import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateNickname, logout, deleteAccount } from './hooks/useSetting';

function SettingPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNicknameSubmit = async () => {
    if (!nickname.trim()) return;
    setIsLoading(true);
    try {
      await updateNickname(nickname.trim());
      setIsEditingNickname(false);
      setNickname('');
      alert('닉네임이 수정되었습니다.');
    } catch (err) {
      console.error('닉네임 수정 실패', err);
      alert('닉네임 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.')) return;
    setIsLoading(true);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('회원 탈퇴 실패', err);
      alert('회원 탈퇴에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settingPage" style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* 닉네임 수정 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>닉네임</span>
        {isEditingNickname ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="새 닉네임 입력"
              maxLength={20}
              style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
            />
            <button
              type="button"
              onClick={handleNicknameSubmit}
              disabled={isLoading || !nickname.trim()}
              style={{ padding: '10px 16px', background: '#268097', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
            >
              확인
            </button>
            <button
              type="button"
              onClick={() => { setIsEditingNickname(false); setNickname(''); }}
              style={{ padding: '10px 16px', background: '#f0f0f0', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
            >
              취소
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingNickname(true)}
            style={{ padding: '14px 16px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', textAlign: 'left', cursor: 'pointer' }}
          >
            닉네임 수정
          </button>
        )}
      </div>

      {/* 로그아웃 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>계정</span>
        <button
          type="button"
          onClick={handleLogout}
          style={{ padding: '14px 16px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: '12px', fontSize: '16px', textAlign: 'left', cursor: 'pointer' }}
        >
          로그아웃
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={isLoading}
        style={{ padding: '14px 16px', background: '#fff', border: '1px solid #ffcccc', borderRadius: '12px', fontSize: '16px', textAlign: 'left', cursor: 'pointer', color: '#e53935' }}
      >
        회원 탈퇴
      </button>

    </div>
  );
}

export default SettingPage;
