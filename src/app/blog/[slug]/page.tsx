import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  } | Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end container mx-auto px-4 pb-12">
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
            
            <div className="max-w-4xl space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm py-1 px-3">
                        {post.category}
                    </Badge>
                     <span className="text-white/80 flex items-center gap-1 text-sm bg-black/30 backdrop-blur rounded-full px-3 py-1">
                        <Calendar className="w-4 h-4" /> {post.date}
                    </span>
                    <span className="text-white/80 flex items-center gap-1 text-sm bg-black/30 backdrop-blur rounded-full px-3 py-1">
                        <Clock className="w-4 h-4" /> {post.readTime}
                    </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black font-montserrat text-white leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/50">
                            <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{post.author.name}</p>
                            <p className="text-sm text-white/60">{post.author.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-3xl mx-auto">
             <div className="bg-card p-8 md:p-12 rounded-2xl border border-border shadow-2xl">
                 <div className="prose prose-invert prose-lg max-w-none">
                     <p className="lead text-xl text-muted-foreground mb-8 font-medium">
                         {post.excerpt}
                     </p>
                     
                     {/* Render content safely if using a CMS, here just mapped */}
                     <div dangerouslySetInnerHTML={{ __html: post.content }} />
                     
                     <hr className="my-8 border-border" />
                     
                     {/* Tags */}
                     <div className="flex flex-wrap gap-2">
                         {post.tags.map(tag => (
                             <span key={tag} className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                 #{tag}
                             </span>
                         ))}
                     </div>
                 </div>
                 
                 {/* Share / Author Bio could go here */}
                 
             </div>
        </div>
      </div>
    </div>
  );
}
