import React, { useEffect, useState } from 'react';
import { fetchCommits } from './api';
import { Table, Statistic, Row, Col, Input, Tooltip as AntdTooltip } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './App.css';

const { Search } = Input;

interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
}

const App: React.FC = () => {
  const [repo, setRepo] = useState<string>('facebook/react');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getCommits = async (repo: string) => {
    setLoading(true);
    try {
      const data = await fetchCommits(repo);
      setCommits(data);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommits(repo);
  }, [repo]);

  if (loading) return <p>Loading...</p>;

  const commitCounts = commits.reduce((acc, commit) => {
    const authorName = commit.commit.author.name;
    if (!acc[authorName]) {
      acc[authorName] = 0;
    }
    acc[authorName]++;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(commitCounts).map(([name, count]) => ({
    name,
    count
  }));

  return (
    <div className="App">
      <header className="App-header">
        <h1>GitHub Commits Dashboard</h1>
        <Search
          placeholder="Enter GitHub repo (e.g., facebook/react)"
          enterButton="Fetch Commits"
          size="large"
          onSearch={(value) => setRepo(value)}
          defaultValue={repo}
        />
      </header>
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Total Commits" value={commits.length} />
        </Col>
        <Col span={16}>
          <BarChart width={600} height={300} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </Col>
      </Row>
      <Table dataSource={commits} rowKey="sha" pagination={false}>
        <Table.Column title="Author" dataIndex={['commit', 'author', 'name']} key="author" />
        <Table.Column title="Message" dataIndex={['commit', 'message']} key="message" />
        <Table.Column title="Date" dataIndex={['commit', 'author', 'date']} key="date" />
      </Table>
    </div>
  );
};

export default App;
