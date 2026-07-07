import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deleteUserForHome, getUsersForHome } from '../services/home/homeService';
import '../styles/homepage.css';

const DEFAULT_LIMIT = 10;
const EMPTY_FILTERS = {
  username: '',
  security_answer: '',
};

const getUserId = (user) => user?.id || user?.user_id || user?._id;

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || {};
    } catch {
      return {};
    }
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async ({ page = 1, limit = DEFAULT_LIMIT } = {}) => {
    setLoading(true);
    setError('');

    try {
      const requestParams = {
        token,
        page,
        limit,
      };
      const username = appliedFilters.username.trim();
      const securityAnswer = appliedFilters.security_answer.trim();

      if (username) requestParams.username = username;
      if (securityAnswer) requestParams.security_answer = securityAnswer;

      const response = await getUsersForHome(requestParams);

      setUsers(Array.isArray(response.data) ? response.data : []);
      setPagination({
        page: response.pagination?.page || page,
        limit: response.pagination?.limit || limit,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      });
    } catch (err) {
      setUsers([]);
      setError(err?.message || 'Khong the lay danh sach user');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters.security_answer, appliedFilters.username, token]);

  useEffect(() => {
    fetchUsers({ page: 1 });
  }, [fetchUsers]);

  const handleLogout = () => {
    if (!window.confirm('Ban co chac chan muon dang xuat khong?')) return;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login', { replace: true });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const toggleFilters = () => {
    setShowFilters((current) => !current);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setAppliedFilters({
      username: filters.username.trim(),
      security_answer: filters.security_answer.trim(),
    });
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setMessage('');
    setShowFilters(false);
  };

  const handleDeleteUser = async (selectedUser) => {
    const id = getUserId(selectedUser);

    if (!id) {
      setError('Khong xac dinh duoc id user de xoa');
      return;
    }

    if (!window.confirm(`Ban co chac chan muon xoa user "${selectedUser.username || id}" khong?`)) {
      return;
    }

    setDeletingId(id);
    setError('');
    setMessage('');

    try {
      const response = await deleteUserForHome({ token, id });
      setMessage(response?.message || 'Xoa user thanh cong');

      const nextPage = users.length === 1 && pagination.page > 1
        ? pagination.page - 1
        : pagination.page;

      await fetchUsers({ page: nextPage });
    } catch (err) {
      setError(err?.message || 'Xoa user that bai');
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page) => {
    if (page < 1 || page > Math.max(pagination.totalPages, 1) || loading) return;
    fetchUsers({ page });
  };

  const pageLabel = useMemo(() => {
    if (!pagination.total) return '0 user';

    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.total);

    return `${start}-${end} / ${pagination.total} user`;
  }, [pagination]);

  const displayData = {
    brand: 'Gradiator',
    title: 'Quan ly user',
    greeting: `Xin chao ${user.username || 'ban'}, ban co the loc va xoa user tai day.`,
    logoutText: 'Dang xuat',
  };

  return (
    <main className="home-shell">
      <section className="home-panel home-header">
        <div>
          <p className="home-kicker">{displayData.brand}</p>
          <h1>{displayData.title}</h1>
          <p className="home-subtitle">{displayData.greeting}</p>
        </div>

        <button className="btn primary home-logout" type="button" onClick={handleLogout} title={displayData.logoutText}>
          <FaSignOutAlt />
          <span>{displayData.logoutText}</span>
        </button>
      </section>

      <section className="user-management">
        <div className="user-toolbar">
          <div>
            <h2>Danh sach user</h2>
            <p>{pagination.total ? `Dang hien thi ${pagination.total} user` : 'Tai danh sach user trong he thong'}</p>
          </div>

          <div className="toolbar-actions">
            <button className="btn filter-toggle" type="button" onClick={toggleFilters}>
              <FaFilter />
              <span>Loc</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <form className="user-filters" onSubmit={handleFilterSubmit}>
            <div className="filter-field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                placeholder="Nhap username"
              />
            </div>

            <div className="filter-field">
              <label htmlFor="security_answer">Answer security</label>
              <input
                id="security_answer"
                name="security_answer"
                value={filters.security_answer}
                onChange={handleFilterChange}
                placeholder="Nhap cau tra loi"
              />
            </div>

            <div className="filter-actions">
              <button className="btn primary filter-search" type="submit" disabled={loading} title="Tim kiem">
                <FaSearch />
                <span>Tim</span>
              </button>
              <button className="btn filter-clear" type="button" onClick={handleClearFilters} disabled={loading}>
                Xoa loc
              </button>
            </div>
          </form>
        )}

        {message && <div className="notice success-text">{message}</div>}
        {error && <div className="notice error-text">{error}</div>}

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Created at</th>
                <th aria-label="Hanh dong" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="table-state">Dang tai danh sach user...</td>
                </tr>
              ) : users.length ? (
                users.map((item) => {
                  const id = getUserId(item);

                  return (
                    <tr key={id || item.username}>
                      <td>{item.username || '-'}</td>
                      <td>{item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : '-'}</td>
                      <td className="table-actions">
                        <button
                          className="icon-btn danger"
                          type="button"
                          onClick={() => handleDeleteUser(item)}
                          disabled={deletingId === id}
                          title="Xoa user"
                          aria-label={`Xoa user ${item.username || id}`}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="table-state">Khong co user phu hop</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span>{pageLabel}</span>
          <div className="pagination-actions">
            <button
              className="icon-btn"
              type="button"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              title="Trang truoc"
              aria-label="Trang truoc"
            >
              <FaChevronLeft />
            </button>
            <strong>Trang {pagination.page} / {Math.max(pagination.totalPages, 1)}</strong>
            <button
              className="icon-btn"
              type="button"
              onClick={() => goToPage(pagination.page + 1)}
              disabled={pagination.page >= Math.max(pagination.totalPages, 1) || loading}
              title="Trang sau"
              aria-label="Trang sau"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
