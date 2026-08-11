import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Course, Topic, Material } from '../../../types';
import { Modal } from '../../../components/ui/Modal';
import { Plus, FolderPlus, FileText, Trash2, Edit, ExternalLink, BookOpen } from 'lucide-react';

export const AdminMaterials: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);

  // Topic Form
  const [topicName, setTopicName] = useState('');
  const [topicCourseId, setTopicCourseId] = useState('');
  const [topicError, setTopicError] = useState('');

  // Material Form
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialCourseId, setMaterialCourseId] = useState('');
  const [materialTopicId, setMaterialTopicId] = useState('');
  const [materialContent, setMaterialContent] = useState('');
  const [materialFileType, setMaterialFileType] = useState('DOCUMENT');
  const [materialOrder, setMaterialOrder] = useState('1');
  const [materialError, setMaterialError] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [crs, mats, tops] = await Promise.all([
        api.getCourses(),
        api.getMaterials(selectedCourseId !== 'ALL' ? selectedCourseId : undefined),
        api.getTopics(selectedCourseId !== 'ALL' ? selectedCourseId : undefined),
      ]);
      setCourses(crs);
      setMaterials(mats);
      setTopics(tops);

      if (crs.length > 0) {
        if (!topicCourseId) setTopicCourseId(crs[0].id);
        if (!materialCourseId) setMaterialCourseId(crs[0].id);
      }
    } catch (err) {
      console.error('Failed to load material data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCourseId]);

  // Sync topics when course selection in material modal changes
  const handleMaterialCourseChange = async (cId: string) => {
    setMaterialCourseId(cId);
    try {
      const topList = await api.getTopics(cId);
      if (topList.length > 0) {
        setMaterialTopicId(topList[0].id);
      } else {
        setMaterialTopicId('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopicError('');
    if (!topicName.trim() || !topicCourseId) {
      setTopicError('Topic Name and Course selection are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createTopic(topicName, topicCourseId);
      setTopicName('');
      setIsTopicModalOpen(false);
      fetchData();
    } catch (err: any) {
      setTopicError(err.message || 'Failed to create topic.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setMaterialError('');
    if (!materialTitle.trim() || !materialCourseId || !materialTopicId) {
      setMaterialError('Title, Course, and Topic are required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.createMaterial({
        title: materialTitle,
        courseId: materialCourseId,
        topicId: materialTopicId,
        content: materialContent,
        fileType: materialFileType,
        order: Number(materialOrder) || 1,
      });
      setMaterialTitle('');
      setMaterialContent('');
      setIsMaterialModalOpen(false);
      fetchData();
    } catch (err: any) {
      setMaterialError(err.message || 'Failed to create material.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.deleteMaterial(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete material.');
    }
  };

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic and all its materials?')) return;
    try {
      await api.deleteTopic(id);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete topic.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Course Materials & Topics</h1>
          <p>Organize topics and publish learning resources for courses</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary" onClick={() => setIsTopicModalOpen(true)}>
            <FolderPlus size={18} /> Add Topic
          </button>
          <button className="btn btn-primary" onClick={() => setIsMaterialModalOpen(true)}>
            <Plus size={18} /> Add Course Material
          </button>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <strong style={{ fontSize: '0.9rem' }}>Filter Course:</strong>
          <select
            className="form-select"
            style={{ maxWidth: 350 }}
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="ALL">-- All Courses --</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code || 'No Code'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials List grouped by Topic */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading materials...</div>
        ) : materials.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No materials found for the selected filter. Click "Add Course Material" to create one!
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Material Title</th>
                  <th>Course</th>
                  <th>Topic</th>
                  <th>Type</th>
                  <th>Content / Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat) => (
                  <tr key={mat.id}>
                    <td>
                      <span
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        #{mat.order}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '0.9rem' }}>{mat.title}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {mat.course?.name}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: 'var(--primary-light)',
                          color: '#a5b4fc',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        {mat.topic?.name}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-main)' }}>
                        {mat.fileType}
                      </span>
                    </td>
                    <td>
                      {mat.content?.startsWith('http') ? (
                        <a
                          href={mat.content}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          Resource Link <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {mat.content || 'Text content'}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteMaterial(mat.id)}
                        title="Delete Material"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      <Modal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        title="Add Course Topic"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsTopicModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateTopic} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Topic'}
            </button>
          </>
        }
      >
        {topicError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 16,
            }}
          >
            {topicError}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Select Course</label>
          <select
            className="form-select"
            value={topicCourseId}
            onChange={(e) => setTopicCourseId(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Topic Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Frontend Architecture & React Hooks"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Add Material Modal */}
      <Modal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        title="Add Course Material"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsMaterialModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateMaterial} disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Material'}
            </button>
          </>
        }
      >
        {materialError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 16,
            }}
          >
            {materialError}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. React Component Design Guide (PDF)"
            value={materialTitle}
            onChange={(e) => setMaterialTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="form-select"
              value={materialCourseId}
              onChange={(e) => handleMaterialCourseChange(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Topic</label>
            <select
              className="form-select"
              value={materialTopicId}
              onChange={(e) => setMaterialTopicId(e.target.value)}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">File / Resource Type</label>
            <select
              className="form-select"
              value={materialFileType}
              onChange={(e) => setMaterialFileType(e.target.value)}
            >
              <option value="DOCUMENT">DOCUMENT</option>
              <option value="PDF">PDF</option>
              <option value="LINK">LINK</option>
              <option value="VIDEO">VIDEO</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sequence Order</label>
            <input
              type="number"
              className="form-input"
              value={materialOrder}
              onChange={(e) => setMaterialOrder(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Content URL or Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="https://example.com/slide-deck.pdf"
            value={materialContent}
            onChange={(e) => setMaterialContent(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
