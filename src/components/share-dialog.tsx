import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Locale } from '../../i18n/config';
import { Copy, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

interface ShareDialogProps {
  projectId: string;
  projectTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: Locale;
}

export function ShareDialog({
  projectId,
  projectTitle,
  open,
  onOpenChange,
  locale
}: ShareDialogProps) {
  const { data: session, isPending } = useSession();
  const [isCopied, setIsCopied] = useState(false);
  
  // 项目URL
  const projectUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${locale}/project/${projectId}`
    : `/${locale}/project/${projectId}`;
  
  // 复制链接
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setIsCopied(true);
      
      toast({
        title: locale === 'zh-cn' ? '链接已复制' : 'Link copied',
        description: locale === 'zh-cn' ? '项目链接已复制到剪贴板' : 'Project link copied to clipboard',
        variant: 'default',
      });
      
      // 记录分享操作
      if (session?.user?.id) {
        recordShare('copy_link');
      }
      
      // 重置复制状态
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('复制链接失败:', error);
      toast({
        title: locale === 'zh-cn' ? '复制失败' : 'Copy failed',
        description: String(error),
        variant: 'destructive',
      });
    }
  };
  
  // 记录分享操作
  const recordShare = async (platform: string) => {
    try {
      await fetch('/api/social/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          platform
        }),
      });
    } catch (error) {
      console.error('记录分享失败:', error);
    }
  };
  
  // 社交媒体分享
  const shareToSocial = (platform: string) => {
    let shareUrl = '';
    const text = locale === 'zh-cn' 
      ? `在CodeTok上查看这个项目: ${projectTitle}`
      : `Check out this project on CodeTok: ${projectTitle}`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(projectUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl)}&title=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    
    // 打开分享窗口
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    // 记录分享操作
    if (session?.user?.id) {
      recordShare(platform);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{locale === 'zh-cn' ? '分享项目' : 'Share Project'}</DialogTitle>
          <DialogDescription>
            {locale === 'zh-cn' 
              ? '与朋友和同事分享这个项目' 
              : 'Share this project with your friends and colleagues'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={projectUrl}
            readOnly
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={copyLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">
            {locale === 'zh-cn' ? '分享到社交媒体' : 'Share on social media'}
          </h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('twitter')}
              title={locale === 'zh-cn' ? '分享到 Twitter' : 'Share on Twitter'}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('facebook')}
              title={locale === 'zh-cn' ? '分享到 Facebook' : 'Share on Facebook'}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('linkedin')}
              title={locale === 'zh-cn' ? '分享到 LinkedIn' : 'Share on LinkedIn'}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            {locale === 'zh-cn' ? '关闭' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 