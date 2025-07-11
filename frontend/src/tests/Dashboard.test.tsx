import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import axios from '../api/axios';
import jwtDecode from 'jwt-decode';

jest.mock('../api/axios');
jest.mock('jwt-decode', () => jest.fn());

describe('Dashboard Component', () => {
  const mockUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');
    (jwtDecode as jest.Mock).mockReturnValue(mockUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with project form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Add Project')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByText('Create Project')).toBeInTheDocument();
  });

  it('fetches projects on mount', async () => {
    const mockProjects = [
      { _id: '1', title: 'Test Project', description: 'Desc', status: 'active' },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        projects: mockProjects,
        total: 1,
      },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/projects?page=1&limit=4&search=');
    });
  });
});
