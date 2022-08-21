import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";

const fetchMovies = async (param: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${param}?api_key=b474f43311f1a19783cd84ac384af0e8`
  );
  return res.json();
};

type sliderProps = {
  category: string;
};

const Slider = (props: sliderProps) => {
  const [width, setWidth] = useState<number>(0);
  const carousel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!carousel.current) return;
    setWidth(carousel.current.scrollWidth - window.innerWidth / 1.1);
  }, []);
  const { data, isLoading, error } = useQuery([props.category], () =>
    fetchMovies(props.category)
  );
  return (
    <>
      <motion.section className="mx-auto w-[500rem] md:px-20">
        <motion.div
          className="flex w-3/4 cursor-grab"
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          ref={carousel}
          whileTap={{ cursor: "grabbing" }}
        >
          {data &&
            data.results.map((movie: any, index: number) => (
              <motion.div className="mx-3" key={movie.id}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt="movie poster"
                  width={500}
                  height={751}
                  quality={50}
                  placeholder="blur"
                  blurDataURL="/white.png"
                  className="h-full w-full rounded-xl"
                  draggable="false"
                />
              </motion.div>
            ))}
        </motion.div>
      </motion.section>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Image src="/rings.svg" alt="loading icon" width={200} height={200} />
        </div>
      )}
    </>
  );
};

export default Slider;
