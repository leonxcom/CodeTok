import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://i.pravatar.cc/150?img=1",
    name: "张明",
    userName: "@zhang_ming",
    comment: "Nostudy.ai平台真的很棒！帮助我快速成长。",
  },
  {
    image: "https://i.pravatar.cc/150?img=2",
    name: "李小华",
    userName: "@li_xiaohua",
    comment:
      "通过真实项目的驱动学习，我的技能得到了显著提升。非常推荐这个平台！",
  },

  {
    image: "https://i.pravatar.cc/150?img=3",
    name: "王强",
    userName: "@wang_qiang",
    comment:
      "在Nostudy.ai上公开构建项目，不仅帮我获得了技术反馈，还让我结识了许多志同道合的朋友。",
  },
  {
    image: "https://i.pravatar.cc/150?img=4",
    name: "赵芳",
    userName: "@zhao_fang",
    comment:
      "作为AI创作者，Nostudy.ai给了我一个展示作品和获得粉丝的绝佳平台。感谢这个社区！",
  },
  {
    image: "https://i.pravatar.cc/150?img=5",
    name: "陈晓",
    userName: "@chen_xiao",
    comment:
      "最喜欢Nostudy.ai的社区互动功能，通过这个平台我已经获得了300多位铁杆粉丝！",
  },
  {
    image: "https://i.pravatar.cc/150?img=6",
    name: "林小勇",
    userName: "@lin_xiaoyong",
    comment:
      "从一个AI初学者到现在能独立开发项目，Nostudy.ai一路相伴。这里的教程和社区支持非常给力！",
  },
];

export const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          People Love{" "}
        </span>
        This Landing Page
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non unde error
        facere hic reiciendis illo
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage
                    alt=""
                    src={image}
                  />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
