'use client';

import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export function ImportTimeTable() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択ダイアログを開く
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ファイルが選択された時の処理
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // ファイルの内容をJSONとして読み込む
      const fileContent = await readFileAsText(file);

      // JSONの形式を検証
      try {
        JSON.parse(fileContent);
      } catch (error) {
        throw new Error('有効なJSONファイルではありません');
      }

      // APIに送信
      const response = await fetch('/api/timetable/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ timeTableJsonText: fileContent }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '時間割のインポートに失敗しました');
      }

      toast.success('時間割を正常にインポートしました！', {
        description: '成功',
      });

      // 入力フィールドをリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('時間割インポートエラー:', error);
      toast.error(error instanceof Error ? error.message : '時間割のインポートに失敗しました', {
        description: 'エラー',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // デモデータを使用したインポート
  const handleImportDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/timetable/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useDemo: true }),
      });

      if (!response.ok) {
        throw new Error('時間割のインポートに失敗しました');
      }

      toast.success('デモの時間割を正常にインポートしました！', {
        description: '成功',
      });
    } catch (error) {
      console.error('時間割インポートエラー:', error);
      toast.error(error instanceof Error ? error.message : '時間割のインポートに失敗しました', {
        description: 'エラー',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ファイルをテキストとして読み込む関数
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('ファイルの読み込みに失敗しました'));
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込みエラー'));
      reader.readAsText(file);
    });
  };

  return (
    <div className='flex space-x-2'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='.json'
        className='hidden'
      />
      <Button
        onClick={openFileSelector}
        disabled={isLoading}
        size='sm'
        variant='outline'
        className='whitespace-nowrap'
      >
        {isLoading ? 'インポート中...' : 'JSONファイルをインポート'}
      </Button>
      <Button
        onClick={handleImportDemo}
        disabled={isLoading}
        size='sm'
        variant='secondary'
        className='whitespace-nowrap'
      >
        デモデータ使用
      </Button>
    </div>
  );
}
