'use client';

import { useRef } from 'react';

interface ImportTimeTableButtonProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ImportTimeTableButton = ({ isLoading, setIsLoading }: ImportTimeTableButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const timeTableJsonText = await readFileAsText(file);
      await sendTimeTableData(timeTableJsonText);
      alert('時間割のインポートが完了しました');
    } catch (error) {
      console.error('時間割のインポートエラー:', error);
      alert('時間割のインポートに失敗しました');
    } finally {
      setIsLoading(false);
      // ファイル入力をリセット（同じファイルを再度選択できるように）
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error('ファイルの読み込みに失敗しました'));
      reader.readAsText(file);
    });
  };

  const sendTimeTableData = async (timeTableJsonText: string) => {
    const response = await fetch('/api/timetable/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timeTableJsonText }),
    });

    if (!response.ok) {
      throw new Error('時間割のインポートに失敗しました');
    }

    return await response.json();
  };

  const handleTimeTable = () => {
    handleFileSelect();
  };

  return (
    <>
      <input
        type='file'
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept='.json'
        onChange={handleFileChange}
      />
      <button
        className='flex items-center border border-solid border-slate-900 p-1'
        onClick={handleTimeTable}
        disabled={isLoading}
      >
        {isLoading ? '読込中...' : 'インポート'}
      </button>
    </>
  );
};

export default ImportTimeTableButton;
