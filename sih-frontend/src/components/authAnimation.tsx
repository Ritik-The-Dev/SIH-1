import { motion } from "framer-motion";
import {
  FaRocket,
  FaSatellite,
} from "react-icons/fa";

export default function AuthAnimation({cn , darkMode, t , head , body}: {cn: (...classes: string[]) => string, darkMode: boolean, t: (key: string) => string, head : string, body: string}) {
    return(
         <div
        className={cn(
          "w-full md:w-1/2 relative flex items-center justify-center p-8",
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-indigo-900 to-purple-900"
        )}
      >
        <div className="text-center z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {t(head)}
            </h2>
            <p className="text-indigo-200">{t(body)}</p>
          </motion.div>
        </div>

        {/* Background Animations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ y: "100vh", x: "30%" }}
            animate={{ y: "-100vh", x: "30%" }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute left-1/2 bottom-0"
          >
            <FaRocket className="text-yellow-300 text-3xl" />
          </motion.div>

          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <FaSatellite className="text-pink-300 text-5xl" />
          </motion.div>

          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <FaSatellite className="text-teal-300 text-3xl" />
          </motion.div>

          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white rounded-full absolute"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
    )
}