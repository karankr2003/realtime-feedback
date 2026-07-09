'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/useAuth';

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    description: '',
    email: '',
    rating: '',
  });
  const { token } = useAuth();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const response = await apiClient.getCategories();
    if (response.success && response.data) {
      setCategories(response.data);
      if (response.data.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: response.data![0].id.toString() }));
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleRatingChange = (rating: string) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await apiClient.submitFeedback(
        parseInt(formData.categoryId),
        formData.title,
        formData.description,
        formData.email,
        formData.rating ? parseInt(formData.rating) : undefined,
        token || undefined
      );

      if (!response.success) {
        setError(response.error || 'Failed to submit feedback');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        categoryId: categories[0]?.id.toString() || '',
        title: '',
        description: '',
        email: '',
        rating: '',
      });

      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setError('An error occurred while submitting feedback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-green-200">Thank you! Your feedback has been submitted successfully.</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-purple-200/80 mb-2">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          disabled={isLoading}
          className="bg-slate-950/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-slate-400"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-purple-200/80 mb-2">
          Feedback Category
        </label>
        <Select value={formData.categoryId} onValueChange={(value) => handleSelectChange(value as string)} disabled={isLoading}>
          <SelectTrigger id="category" className="w-full bg-slate-950/50 border-purple-500/30 focus:border-purple-500 text-white">
            <SelectValue placeholder="Select a category">
              {categories.find((c) => c.id.toString() === formData.categoryId)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-950 border-purple-500/30">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()} className="text-white focus:bg-purple-500/20">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-purple-200/80 mb-2">
          Title
        </label>
        <Input
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={255}
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Brief title of your feedback"
          disabled={isLoading}
          className="bg-slate-950/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-slate-400"
        />
        <p className="text-xs text-purple-300/60 mt-1">
          {formData.title.length}/255 characters
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-purple-200/80 mb-2">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={5000}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Detailed description of your feedback"
          disabled={isLoading}
          rows={6}
          className="bg-slate-950/50 border-purple-500/30 focus:border-purple-500 text-white placeholder:text-slate-400"
        />
        <p className="text-xs text-purple-300/60 mt-1">
          {formData.description.length}/5000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-purple-200/80 mb-2">
          Rating (Optional)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingChange(rating.toString())}
              disabled={isLoading}
              className={`w-12 h-12 rounded-xl border-2 transition-all duration-200 font-medium text-lg ${
                formData.rating === rating.toString()
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                  : 'border-purple-500/30 bg-slate-950/50 text-purple-300 hover:border-purple-500 hover:text-white hover:bg-purple-500/10'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-lg shadow-purple-500/30 transition-all duration-200"
        size="lg"
      >
        {isLoading ? 'Submitting...' : 'Submit Feedback'}
      </Button>
    </form>
  );
}
