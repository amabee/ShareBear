"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  Calendar,
  Award,
  Globe,
  Mail,
  Phone,
  Camera,
  Music,
  Palette,
  Coffee,
  Mountain,
  Book,
} from "lucide-react";

export function ProfileAbout({ user }) {
  const achievements = [
    { title: "Content Creator of the Year", year: "2023", icon: Award },
    { title: "10K Followers Milestone", year: "2023", icon: Heart },
    { title: "Photography Contest Winner", year: "2022", icon: Camera },
    { title: "Community Builder Award", year: "2022", icon: Globe },
  ];

  const interests = [
    { name: "Photography", icon: Camera, level: "Expert" },
    { name: "Travel", icon: Mountain, level: "Enthusiast" },
    { name: "Music", icon: Music, level: "Intermediate" },
    { name: "Art & Design", icon: Palette, level: "Hobbyist" },
    { name: "Coffee Culture", icon: Coffee, level: "Connoisseur" },
    { name: "Reading", icon: Book, level: "Avid Reader" },
  ];

  const personalInfo = [
    { label: "Current City", value: user.location, icon: MapPin },
    { label: "Hometown", value: "Portland, OR", icon: MapPin },
    { label: "Occupation", value: "Digital Content Creator", icon: Briefcase },
    {
      label: "Education",
      value: "Bachelor's in Visual Arts",
      icon: GraduationCap,
    },
    { label: "Relationship Status", value: "Single", icon: Heart },
    { label: "Languages", value: "English, Spanish, French", icon: Globe },
  ];

  const contactInfo = [
    { label: "Website", value: user.website, icon: Globe },
    { label: "Email", value: "hello@johndoe.com", icon: Mail },
    { label: "Business Inquiries", value: "business@johndoe.com", icon: Mail },
  ];

  return (
    <div className="space-y-6">
      {/* Main Bio Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">About {user.name}</h3>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Passionate digital creator and photography enthusiast based in San
              Francisco. I love capturing life's beautiful moments and sharing
              them with the world. My journey started with a simple camera and a
              desire to tell stories through images.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              When I'm not behind the camera, you can find me exploring new
              places, trying different cuisines, or creating content that makes
              people smile. I believe in the power of visual storytelling and
              the connections we can build through shared experiences.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I'm always looking for new collaborations and creative projects.
              Whether it's a brand partnership, a photography session, or just a
              good conversation about art and life, I'm here for it!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{info.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {info.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Interests & Hobbies */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Interests & Hobbies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interests.map((interest) => {
              const Icon = interest.icon;
              return (
                <div
                  key={interest.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{interest.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {interest.level}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{interest.level}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.year}
                    </p>
                  </div>
                  <Badge variant="secondary">{achievement.year}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            {contactInfo.map((contact) => {
              const Icon = contact.icon;
              return (
                <div
                  key={contact.label}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{contact.label}</p>
                    <p className="text-sm text-primary hover:underline cursor-pointer">
                      {contact.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Fun Facts */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Fun Facts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                📸 Photography Started
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Been taking photos for over 8 years
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <p className="font-medium text-green-900 dark:text-green-100">
                🌍 Countries Visited
              </p>
              <p className="text-sm text-green-700 dark:text-green-200">
                Traveled to 23 countries so far
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <p className="font-medium text-purple-900 dark:text-purple-100">
                ☕ Coffee Lover
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-200">
                Drinks 3-4 cups of coffee daily
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
              <p className="font-medium text-orange-900 dark:text-orange-100">
                🎨 Creative Projects
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-200">
                Completed 50+ creative collaborations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
