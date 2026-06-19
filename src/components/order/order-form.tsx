'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateOrderSchema } from '@/lib/validators';
import { PAPER_TYPES, ACADEMIC_LEVELS, CITATION_STYLES, WORDS_PER_PAGE } from '@/types/order';
import { calculatePrice } from '@/lib/pricing';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function OrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [pricing, setPricing] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      paperType: 'essay',
      academicLevel: 'undergraduate',
      citationStyle: 'apa',
      wordCount: 1000,
      pages: 4,
      preferences: {},
    },
  });

  const formData = watch();

  // Update pricing whenever form changes
  React.useEffect(() => {
    const newPricing = calculatePrice({
      ...formData,
      wordCount: parseInt(formData.wordCount?.toString() || '1000'),
    });
    setPricing(newPricing);
  }, [formData]);

  // Update pages when word count changes
  React.useEffect(() => {
    const pages = Math.ceil((parseInt(formData.wordCount?.toString() || '250')) / WORDS_PER_PAGE);
    // Update pages display
  }, [formData.wordCount]);

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = [...e.dataTransfer.files];
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e: any) => {
    const selectedFiles = [...e.target.files];
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Save to localStorage for now (will use API in payment step)
      const orderData = {
        ...data,
        pages: Math.ceil((parseInt(data.wordCount?.toString() || '250')) / WORDS_PER_PAGE),
        pricing,
        fileCount: files.length,
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));
      router.push('/order/preview');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="col-span-2 space-y-6">
          {/* Paper Type */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Paper Type *</label>
            <select
              {...register('paperType')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {PAPER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.paperType && <p className="text-red-500 text-sm mt-1">{(errors.paperType as any).message}</p>}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Topic/Title *</label>
            <input
              {...register('topic')}
              type="text"
              placeholder="Enter your paper topic or title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.topic && <p className="text-red-500 text-sm mt-1">{(errors.topic as any).message}</p>}
          </div>

          {/* Academic Level & Citation Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Academic Level *</label>
              <select
                {...register('academicLevel')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.academicLevel && <p className="text-red-500 text-sm mt-1">{(errors.academicLevel as any).message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Citation Style *</label>
              <select
                {...register('citationStyle')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CITATION_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              {errors.citationStyle && <p className="text-red-500 text-sm mt-1">{(errors.citationStyle as any).message}</p>}
            </div>
          </div>

          {/* Word Count & Deadline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Word Count *</label>
              <input
                {...register('wordCount', { valueAsNumber: true })}
                type="number"
                min="100"
                max="100000"
                placeholder="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-gray-500 text-xs mt-1">
                Pages: {Math.ceil((parseInt(formData.wordCount?.toString() || '250')) / WORDS_PER_PAGE)}
              </p>
              {errors.wordCount && <p className="text-red-500 text-sm mt-1">{(errors.wordCount as any).message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Deadline *</label>
              <input
                {...register('deadline', { valueAsDate: true })}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.deadline && <p className="text-red-500 text-sm mt-1">{(errors.deadline as any).message}</p>}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Instructions *</label>
            <textarea
              {...register('instructions')}
              placeholder="Describe your requirements, format preferences, specific sources, etc."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.instructions && <p className="text-red-500 text-sm mt-1">{(errors.instructions as any).message}</p>}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Attachments (Optional)</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <p className="text-gray-600 font-medium">Drag files here or click to browse</p>
                <p className="text-gray-500 text-sm mt-1">PDF, Word, Excel, images, etc.</p>
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-medium text-dark mb-4">Additional Preferences</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.bestWriter')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Best Writer Available (5% discount)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.premiumWriter')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Premium Writer (+25%)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.top10')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Top 10 Writer (+30%)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.proofreading')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Proofreading ($2.55/page)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.originalityReport')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Originality Report ($29.99)</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" {...register('preferences.urgentAssignment')} className="w-4 h-4" />
                <span className="ml-2 text-sm text-gray-700">Urgent Assignment (+$9.99)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
            <h3 className="text-lg font-bold text-dark mb-4">Order Summary</h3>

            {pricing && (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">${pricing.basePrice.toFixed(2)}</span>
                </div>

                {pricing.writerMultiplier > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Writer Premium:</span>
                    <span className="font-medium">+{((pricing.writerMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {pricing.urgencyMultiplier > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Urgency Premium:</span>
                    <span className="font-medium">+{((pricing.urgencyMultiplier - 1) * 100).toFixed(0)}%</span>
                  </div>
                )}

                {pricing.additionalServices > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Additional Services:</span>
                    <span className="font-medium">${pricing.additionalServices.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${pricing.subtotal.toFixed(2)}</span>
                  </div>

                  {pricing.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>Discount ({pricing.discountPercent}%):</span>
                      <span>-${pricing.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-dark">Total:</span>
                  <span className="text-2xl font-bold text-primary">${pricing.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {loading ? 'Processing...' : 'Continue to Preview'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
