import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchCommits = async (repo: string) => {
    try {
        const response = await axios.get(`${GITHUB_API_URL}/repos/${repo}/commits`);
        return response.data;
    } catch (error) {
        console.error("Error fetching data", error);
        throw error;
    }
};