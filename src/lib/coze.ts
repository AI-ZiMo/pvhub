
import type { CozeRequest, CozeResponse } from './types';

export async function runCozeWorkflow(params: CozeRequest): Promise<CozeResponse> {
  console.log('开始执行 Coze 工作流:', {
    时间: new Date().toLocaleString(),
    参数: params
  });

  const response = await fetch('https://api.coze.cn/v1/workflow/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer xxxx'
    },
    body: JSON.stringify({
      workflow_id: 'xxxxxx',
      parameters: {
        URL: params.URL,
        Title: params.Title,
        words: params.words || 200
      }
    })
  });

  if (!response.ok) {
    console.error('API 请求失败:', {
      状态码: response.status,
      状态文本: response.statusText,
      时间: new Date().toLocaleString()
    });
    throw new Error('API request failed');
  }

  const data = await response.json();
  console.log('Coze 工作流执行完成:', {
    时间: new Date().toLocaleString(),
    结果: data
  });

  return data.data;
}
